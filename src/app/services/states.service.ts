import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { State } from '@interfaces/state';
import { Observable, tap } from 'rxjs';

interface StateService {
  states: State[];
  loading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class StatesService {
  private http = inject(HttpClient);
  #state = signal<StateService>({
    states: [],
    loading: true,
  });

  public states = computed(() => this.#state().states);
  public loading = computed(() => this.#state().loading);

  constructor() {
    this.loadStorage();
  }

  private saveStorage(states: State[]) {
    if (states.length > 0) {
      localStorage.setItem('states', JSON.stringify(this.#state().states));
    } else {
      localStorage.removeItem('states');
    }
  }

  private loadStorage() {
    if (localStorage.getItem('states')) {
      this.#state.set({
        loading: false,
        states: JSON.parse(localStorage.getItem('states')!),
      });
    } else {
      this.getAllStates();
    }
  }

  public postStates(state: Partial<State>): Observable<State> {
    return this.http.post<State>(`${environment.url_api}/states/`, state).pipe(
      tap((resState) => {
        const oldState = this.#state().states;
        oldState.push(resState);
        this.#state.set({
          loading: false,
          states: oldState,
        });
        this.saveStorage(this.#state().states);
      })
    );
  }

  public getAllStates(): void {
    this.#state.set({
      loading: true,
      states: this.#state().states,
    });
    this.http.get<State[]>(`${environment.url_api}/states/`).subscribe(
      (res) => {
        this.#state.set({
          loading: false,
          states: res,
        });
      },
      (error) => {
        this.#state.set({
          loading: false,
          states: [],
        });
      }
    );
  }

  public updateState(id: number, state: Partial<State>) {
    return this.http
      .patch<State>(`${environment.url_api}/states/${id}`, state)
      .pipe(
        tap((resState) => {
          const oldState = this.#state().states;
          const index = oldState.findIndex(
            (i) => i.id_state === resState.id_state
          );
          oldState[index] = resState;
          this.#state.set({
            loading: false,
            states: oldState,
          });
          this.saveStorage(this.#state().states);
        })
      );
  }

  public deleteStates(id: number) {
    this.#state.set({
      loading: false,
      states: this.states().filter((i) => i.id_state !== id),
    });
    this.saveStorage(this.#state().states);
    return this.http.delete(`${environment.url_api}/states/${id}`);
  }

  public updateStates(states: State[]) {
    this.#state.set({
      loading: false,
      states,
    });
  }
}
