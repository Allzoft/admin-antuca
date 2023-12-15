import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { Observable, tap } from 'rxjs';
import { environment } from '@environment/environment';
import { Client } from '@interfaces/client';

interface State {
  clients: Client[];
  loading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  public env = environment;

  private http = inject(HttpClient);
  #state = signal<State>({
    loading: true,
    clients: [],
  });

  public clients = computed(() => this.#state().clients);
  public loading = computed(() => this.#state().loading);

  constructor() {
    this.loadStorage();
  }

  private saveStorage(client: Client[]) {
    if (client.length > 0) {
      localStorage.setItem('clients', JSON.stringify(this.#state().clients));
    } else {
      localStorage.removeItem('clients');
    }
  }

  private loadStorage() {
    if (localStorage.getItem('clients')) {
      this.#state.set({
        loading: false,
        clients: JSON.parse(localStorage.getItem('clients')!),
      });
    } else {
      this.getClient();
    }
  }

  public postItem(item: Partial<Client>): Observable<Client> {
    return this.http.post<Client>(`${this.env.url_api}/clients`, item).pipe(
      tap((resItem) => {
        const oldClient = this.#state().clients;
        oldClient.push(resItem);
        this.#state.set({
          loading: false,
          clients: oldClient,
        });
        this.saveStorage(this.#state().clients);
      })
    );
  }

  public getClient(): void {
    this.#state.set({
      loading: true,
      clients: this.#state().clients,
    });
    this.http.get<Client[]>(`${this.env.url_api}/clients`).subscribe(
      (res) => {
        this.#state.set({
          loading: false,
          clients: res,
        });
        localStorage.setItem('clients', JSON.stringify(this.#state().clients));
      },
      (error) => {
        this.#state.set({
          loading: false,
          clients: [],
        });
      }
    );
  }

  public updateItem(id: number, item: Partial<Client>): Observable<Client> {
    return this.http
      .patch<Client>(`${this.env.url_api}/clients/${id}`, item)
      .pipe(
        tap((resItem) => {
          const oldClient = this.#state().clients;
          const index = oldClient.findIndex(
            (i) => i.id_client === resItem.id_client
          );
          oldClient[index] = resItem;
          this.#state.set({
            loading: false,
            clients: oldClient,
          });
          this.saveStorage(this.#state().clients);
        })
      );
  }

  public deleteClient(id: number) {
    this.#state.set({
      loading: false,
      clients: this.clients().filter((i) => i.id_client !== id),
    });
    this.saveStorage(this.#state().clients);

    return this.http.delete(`${this.env.url_api}/clients/${id}`);
  }

  public updateClient(client: Client[]) {
    this.#state.set({
      loading: false,
      clients: client,
    });
  }
}
