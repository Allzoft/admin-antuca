import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { Observable, tap } from 'rxjs';
import { environment } from '@environment/environment';
import { Role } from '@interfaces/role';
import { MenuItem } from '@interfaces/customer';

interface State {
  roles: Role[];
  loading: boolean;
}

interface StateAccesses {
  accesses: MenuItem[];
  loading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class RoleService {
  public env = environment;

  private http = inject(HttpClient);

  #state = signal<State>({
    loading: true,
    roles: [],
  });

  #stateAccesses = signal<StateAccesses>({
    loading: true,
    accesses: [],
  });

  public roles = computed(() => this.#state().roles);
  public accesses = computed(() => this.#stateAccesses().accesses);
  public loading = computed(() => this.#state().loading);
  public loadingAccesses = computed(() => this.#stateAccesses().loading);

  constructor() {
    this.loadStorage();
  }

  private saveStorage(roles: Role[]) {
    if (roles.length > 0) {
      localStorage.setItem('roles', JSON.stringify(this.#state().roles));
    } else {
      localStorage.removeItem('roles');
    }
  }

  private saveStorageAccesses(accesses: MenuItem[]) {
    if (accesses.length > 0) {
      localStorage.setItem(
        'accesses',
        JSON.stringify(this.#stateAccesses().accesses)
      );
    } else {
      localStorage.removeItem('accesses');
    }
  }

  private loadStorage() {
    if (localStorage.getItem('roles')) {
      this.#state.set({
        loading: false,
        roles: JSON.parse(localStorage.getItem('roles')!),
      });
    } else {
      this.getRoles();
    }
    if (localStorage.getItem('accesses')) {
      this.#stateAccesses.set({
        loading: false,
        accesses: JSON.parse(localStorage.getItem('accesses')!),
      });
    } else {
      this.getAccesses();
    }
  }

  public postRole(role: Partial<Role>): Observable<Role> {
    return this.http.post<Role>(`${this.env.url_api}/roles`, role).pipe(
      tap((resRole) => {
        const oldRole = this.#state().roles;
        oldRole.push(resRole);
        this.#state.set({
          loading: false,
          roles: oldRole,
        });
        this.saveStorage(this.#state().roles);
      })
    );
  }

  public postAccess(accesses: Partial<MenuItem>): Observable<MenuItem> {
    return this.http
      .post<MenuItem>(`${this.env.url_api}/accesses`, accesses)
      .pipe(
        tap((resRole) => {
          const oldRole = this.#stateAccesses().accesses;
          oldRole.push(resRole);
          this.#stateAccesses.set({
            loading: false,
            accesses: oldRole,
          });
          this.saveStorageAccesses(this.#stateAccesses().accesses);
        })
      );
  }

  public getRolesWithAccess(): void {
    this.#state.set({
      loading: true,
      roles: this.#state().roles,
    });
    this.http
      .get<Role[]>(`${this.env.url_api}/roles/access`)
      .subscribe((res) => {
        this.#state.set({
          loading: false,
          roles: res,
        });
        localStorage.setItem('roles', JSON.stringify(this.#state().roles));
      });
  }

  public getRoles() {
    return this.http.get<Role[]>(`${this.env.url_api}/roles`);
  }

  public getAccesses(): void {
    this.#stateAccesses.set({
      loading: true,
      accesses: this.#stateAccesses().accesses,
    });
    this.http
      .get<MenuItem[]>(`${this.env.url_api}/accesses`)
      .subscribe((res) => {
        this.#stateAccesses.set({
          loading: false,
          accesses: res,
        });
        localStorage.setItem(
          'accesses',
          JSON.stringify(this.#stateAccesses().accesses)
        );
      });
  }

  public updateRole(id: number, role: Partial<Role>): Observable<Role> {
    return this.http.patch<Role>(`${this.env.url_api}/roles/${id}`, role).pipe(
      tap((resRole) => {
        const oldRole = this.#state().roles;
        const index = oldRole.findIndex((i) => i.id_role === resRole.id_role);
        oldRole[index] = resRole;
        this.#state.set({
          loading: false,
          roles: oldRole,
        });
        this.saveStorage(this.#state().roles);
      })
    );
  }

  public updateAccess(
    id: number,
    access: Partial<MenuItem>
  ): Observable<MenuItem> {
    return this.http
      .patch<MenuItem>(`${this.env.url_api}/accesses/${id}`, access)
      .pipe(
        tap((resRole) => {
          const oldAccess = this.#stateAccesses().accesses;
          const index = oldAccess.findIndex(
            (i) => i.id_access === resRole.id_access
          );
          oldAccess[index] = resRole;
          this.#stateAccesses.set({
            loading: false,
            accesses: oldAccess,
          });
          this.saveStorageAccesses(this.#stateAccesses().accesses);
        })
      );
  }

  public deleteAccess(id: number) {
    this.#stateAccesses.set({
      loading: false,
      accesses: this.accesses().filter((i) => i.id_access !== id),
    });
    this.saveStorageAccesses(this.#stateAccesses().accesses);

    return this.http.delete(`${this.env.url_api}/accesses/${id}`);
  }

  public deleteRole(id: number) {
    this.#state.set({
      loading: false,
      roles: this.roles().filter((i) => i.id_role !== id),
    });
    this.saveStorage(this.#state().roles);

    return this.http.delete(`${this.env.url_api}/roles/${id}`);
  }

  public updateRoles(roles: Role[]) {
    this.#state.set({
      loading: false,
      roles: roles,
    });
  }

  public updateAccesses(accesses: MenuItem[]) {
    this.#stateAccesses.set({
      loading: false,
      accesses: accesses,
    });
  }
}
