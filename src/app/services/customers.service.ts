import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import {
  Customer,
  CustomerLogin,
  CustomerResponse,
} from '@interfaces/customer';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '@environment/environment';

interface State {
  customer: Customer | undefined;
  token: string | undefined;
  loading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CustomersService {
  private router = inject(Router);

  public env = environment;

  private http = inject(HttpClient);
  #state = signal<State>({
    loading: true,
    customer: undefined,
    token: undefined,
  });

  public customer = computed(() => this.#state().customer);
  public loading = computed(() => this.#state().loading);
  public token = computed(() => this.#state().token);

  constructor() {
    this.loadStorage();
  }
  public authLogin(
    credentials: CustomerLogin,
    remember: boolean
  ): Observable<CustomerResponse> {
    if (remember) {
      localStorage.setItem('email', credentials.email);
    } else {
      localStorage.removeItem('email');
    }

    return this.http
      .post<CustomerResponse>(`${environment.url_api}/auth/login`, credentials)
      .pipe(
        tap((res) => {
          this.saveStorage(res);

          this.#state.set({
            loading: false,
            customer: res.customer,
            token: res.access_token,
          });
        })
      );
  }

  private saveStorage(resCustomer: CustomerResponse) {
    localStorage.setItem('customer', JSON.stringify(resCustomer.customer));
    localStorage.setItem('token', resCustomer.access_token.toString());
  }

  private loadStorage() {
    if (localStorage.getItem('token')) {
      console.log(0);
      this.#state.set({
        loading: false,
        customer: JSON.parse(localStorage.getItem('customer')!),
        token: localStorage.getItem('token')!,
      });
      if (this.router.url.includes('/auth')) {
        this.router.navigateByUrl('/dashboard');
      }
    } else {
      console.log(1);

      this.#state.set({
        loading: true,
        customer: undefined,
        token: undefined,
      });
      this.router.navigateByUrl('/auth');
    }
  }

  public closeSession() {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    this.#state.set({
      loading: true,
      customer: undefined,
      token: undefined,
    });
    this.router.navigateByUrl('/auth');
  }

  getUsers(): Observable<Customer[]> {
    return this.http.get<Customer[]>(`${this.env.url_api}/customers`);
  }
}
