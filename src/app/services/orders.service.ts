import { Injectable, computed, inject, signal } from '@angular/core';
import { Order } from '@interfaces/order';
import { environment } from '@environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import moment from 'moment';

interface State {
  orders: Order[];
  loading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class OrdersService {
  private http = inject(HttpClient);
  #state = signal<State>({
    loading: true,
    orders: [],
  });

  public orders = computed(() => this.#state().orders);
  public loading = computed(() => this.#state().loading);

  constructor() {
    this.loadStorage();
  }

  private saveStorage(order: Order[]): void {
    if (order.length > 0) {
      localStorage.setItem('orders', JSON.stringify(this.#state().orders));
    } else {
      localStorage.removeItem('orders');
    }
  }

  private loadStorage(): void {
    if (localStorage.getItem('orders')) {
      this.#state.set({
        loading: false,
        orders: JSON.parse(localStorage.getItem('orders')!),
      });
    } else {
      this.getOrders();
    }
  }

  public postOrder(order: Partial<Order>): Observable<Order> {
    return this.http.post<Order>(`${environment.url_api}/orders`, order).pipe(
      tap((resOrder) => {
        const oldOrder = this.#state().orders;
        oldOrder.push(resOrder);
        this.#state.set({
          loading: false,
          orders: oldOrder,
        });
        this.saveStorage(this.#state().orders);
      })
    );
  }

  public getOrders(): void {
    this.#state.set({
      loading: true,
      orders: this.#state().orders,
    });
    this.http.get<Order[]>(`${environment.url_api}/orders`).subscribe(
      (res) => {
        this.#state.set({
          loading: false,
          orders: res,
        });
        localStorage.setItem('orders', JSON.stringify(this.#state().orders));
      },
      (error) => {
        this.#state.set({
          loading: false,
          orders: [],
        });
      }
    );
  }

  public getOrdersByDates(dateStart: Date, dateEnd: Date): Observable<Order[]> {
    const filterStart = moment(dateStart).format('YYYY-MM-DD');
    const filterEnd = moment(dateEnd).format('YYYY-MM-DD');
    return this.http.get<Order[]>(
      `${environment.url_api}/orders/bydates/${filterStart}/${filterEnd}`
    );
  }

  public updateOrder(id: number, order: Partial<Order>): Observable<Order> {
    return this.http
      .patch<Order>(`${environment.url_api}/orders/${id}`, order)
      .pipe(
        tap((resOrder) => {
          const oldOrder = this.#state().orders;
          const index = oldOrder.findIndex(
            (i) => i.id_order === resOrder.id_order
          );
          oldOrder[index] = resOrder;
          this.#state.set({
            loading: false,
            orders: oldOrder,
          });
          this.saveStorage(this.#state().orders);
        })
      );
  }

  public deleteOrders(id: number) {
    return this.http.delete(`${environment.url_api}/orders/${id}`).pipe(
      tap((_) => {
        this.#state.set({
          loading: false,
          orders: this.orders().filter((i) => i.id_order !== id),
        });
        this.saveStorage(this.#state().orders);
      })
    );
  }

  public getImpressOrder(id: number): Observable<Blob> {
    return this.http.get(`${environment.url_api}/orders/impressOrder/${id}`, {
      responseType: 'blob',
    });
  }

  public updateOrders(orders: Order[]) {
    this.#state.set({
      loading: false,
      orders,
    });
  }
}
