import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { Client } from '@interfaces/client';
import { Order } from '@interfaces/order';
import { SelectItemGroup } from 'primeng/api';
import { debounceTime, Subject, switchMap } from 'rxjs';

interface State {
  data: SelectItemGroup[];
  loading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AutocompleteService {
  public env = environment;
  private http = inject(HttpClient);

  // Estado inicial con signals
  #state = signal<State>({
    loading: false,
    data: [],
  });

  // Subject para manejar el query con debounce
  private querySubject = new Subject<string>();

  // Exponemos la data y el loading como computed signals
  public data = computed(() => this.#state().data);
  public loading = computed(() => this.#state().loading);

  constructor() {
    this.querySubject
      .pipe(
        debounceTime(1000), // Delay de 1 segundo antes de hacer la petición
        switchMap((query) => this.fetchData(query))
      )
      .subscribe(
        (res) => {
          console.log(res);
          console.log(this.transformToGroups(res));

          this.#state.set({
            loading: false,
            data: this.transformToGroups(res),
          });
        },
        (error) => {
          console.error(error);
          this.#state.set({
            loading: false,
            data: [],
          });
        }
      );
  }

  // Método público para iniciar la búsqueda
  public getData(query: string) {
    // Se activa el loading y se preserva la data actual
    this.#state.set({
      loading: true,
      data: this.#state().data,
    });
    this.querySubject.next(query);
  }

  // Realiza la petición HTTP
  private fetchData(query: string) {
    return this.http.get<{ clients: Client[]; orders: Order[] }>(
      `${this.env.url_api}/autocomplete?q=${query}`
    );
  }

  // Transforma la respuesta en grupos que entiende PrimeNG
  private transformToGroups(res: {
    clients?: Client[];
    orders?: Order[];
  }): SelectItemGroup[] {
    return [
      {
        label: 'Clientes',
        value: 'clients',
        items: (res.clients || []).map((client) => ({
          label:
            client.name + ' ' + client.lastname + ' ID: ' + client.id_client,
          value: client,
        })),
      },
      {
        label: 'Órdenes',
        value: 'orders',
        items: (res.orders || []).map((order) => ({
          label:
            'ID: AO' +
            order.id_order +
            ' Cliente: ' +
            order.client?.name +
            ' ' +
            order.client!.lastname +
            ' ' +
            order.date,
          value: order,
        })),
      },
    ];
  }
}
