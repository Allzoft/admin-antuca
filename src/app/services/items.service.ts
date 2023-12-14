import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { Observable, tap } from 'rxjs';
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

  private saveStorage(items: Items[]) {
    if (items.length > 0) {
      localStorage.setItem('items', JSON.stringify(this.#state().items));
    } else {
      localStorage.removeItem('items');
    }
  }

  private loadStorage() {
    if (localStorage.getItem('items')) {
      this.#state.set({
        loading: false,
        items: JSON.parse(localStorage.getItem('items')!),
      });
    } else {
      this.getItems();
    }
  }

  public postItem(item: Partial<Items>): Observable<Items> {
    return this.http.post<Items>(`${this.env.url_api}/items`, item).pipe(
      tap((resItem) => {
        const oldItems = this.#state().items;
        oldItems.push(resItem);
        this.#state.set({
          loading: false,
          items: oldItems,
        });
        this.saveStorage(this.#state().items);
      })
    );
  }

  public getItems(): void {
    this.#state.set({
      loading: true,
      items: this.#state().items,
    });
    this.http.get<Items[]>(`${this.env.url_api}/items`).subscribe((res) => {
      this.#state.set({
        loading: false,
        items: res,
      });
      localStorage.setItem('items', JSON.stringify(this.#state().items));
    });
  }

  public updateItem(id: number, item: Partial<Items>): Observable<Items> {
    return this.http.patch<Items>(`${this.env.url_api}/items/${id}`, item).pipe(
      tap((resItem) => {
        const oldItems = this.#state().items;
        const index = oldItems.findIndex((i) => i.id_item === resItem.id_item);
        oldItems[index] = resItem;
        this.#state.set({
          loading: false,
          items: oldItems,
        });
        this.saveStorage(this.#state().items);
      })
    );
  }

  public deleteItems(id: number) {
    this.#state.set({
      loading: false,
      items: this.items().filter((i) => i.id_item !== id),
    });
    this.saveStorage(this.#state().items);

    return this.http.delete(`${this.env.url_api}/items/${id}`);
  }

  public updateItems(items: Items[]) {
    this.#state.set({
      loading: false,
      items: items,
    });
  }
}
