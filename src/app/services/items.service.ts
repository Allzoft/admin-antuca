import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '@environment/environment';
import { Items } from '@interfaces/items';

interface State {
  items: Items[];
  loading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  public env = environment;

  private http = inject(HttpClient);
  #state = signal<State>({
    loading: true,
    items: [],
  });

  public items = computed(() => this.#state().items);
  public loading = computed(() => this.#state().loading);

  constructor() {
    this.loadStorage();
  }

  // private saveStorage(resCustomer: CustomerResponse) {
  //   localStorage.setItem('customer', JSON.stringify(resCustomer.customer));
  //   localStorage.setItem('token', resCustomer.access_token.toString());
  // }

  private loadStorage() {
    if (localStorage.getItem('items')) {
      this.#state.set({
        loading: false,
        items: JSON.parse(localStorage.getItem('items')!),
      });
    } else {
      this.getItems().subscribe((res) => {
        this.#state.set({
          loading: true,
          items: res,
        });
        localStorage.setItem('items', this.#state().items.toString());
      });
    }
  }

  public postItem(item: Partial<Items>): Observable<Items> {
    //TODO STORAGE
    return this.http.post<Items>(`${this.env.url_api}/items`, item);
  }

  public getItems(): Observable<Items[]> {
    return this.http.get<Items[]>(`${this.env.url_api}/items`);
  }

  public updateItem(id: number, item: Partial<Items>): Observable<Items> {
    //TODO STORAGE
    return this.http.patch<Items>(`${this.env.url_api}/items/${id}`, item);
  }

  public deleteItems(id: number) {
    return this.http.delete(`${this.env.url_api}/items/${id}`);
  }
}
