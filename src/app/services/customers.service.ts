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

interface StateCustomers {
  customers: Customer[];
  loadingCustomers: boolean;
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

  #stateCustomers = signal<StateCustomers>({
    loadingCustomers: true,
    customers: [],
  });

  public customer = computed(() => this.#state().customer);
  public loading = computed(() => this.#state().loading);
  public token = computed(() => this.#state().token);

  public customers = computed(() => this.#stateCustomers().customers);
  public loadingCustomers = computed(
    () => this.#stateCustomers().loadingCustomers
  );

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

  private saveStorageCustomers(customers: Customer[]) {
    if (customers.length > 0) {
      localStorage.setItem(
        'customers',
        JSON.stringify(this.#stateCustomers().customers)
      );
    } else {
      localStorage.removeItem('customers');
    }
  }

  private loadStorage() {
    if (localStorage.getItem('token')) {
      this.#state.set({
        loading: false,
        customer: JSON.parse(localStorage.getItem('customer')!),
        token: localStorage.getItem('token')!,
      });
      if (this.router.url.includes('/auth')) {
        this.router.navigateByUrl('/dashboard');
      }
    } else {
      this.#state.set({
        loading: true,
        customer: undefined,
        token: undefined,
      });
      this.router.navigateByUrl('/auth');
    }

    if (localStorage.getItem('customers')) {
      this.#stateCustomers.set({
        loadingCustomers: false,
        customers: JSON.parse(localStorage.getItem('customers')!),
      });
    } else {
      this.getUsers();
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

  public postClient(customer: Partial<Customer>): Observable<Customer> {
    return this.http
      .post<Customer>(`${this.env.url_api}/customers`, customer)
      .pipe(
        tap((resCustomer) => {
          const oldCustomer = this.#stateCustomers().customers;
          oldCustomer.push(resCustomer);
          this.#stateCustomers.set({
            loadingCustomers: false,
            customers: oldCustomer,
          });
          this.saveStorageCustomers(this.#stateCustomers().customers);
        })
      );
  }

  public getUsers(): void {
    this.#stateCustomers.set({
      loadingCustomers: true,
      customers: this.#stateCustomers().customers,
    });
    this.http.get<Customer[]>(`${this.env.url_api}/customers`).subscribe(
      (res) => {
        this.#stateCustomers.set({
          loadingCustomers: false,
          customers: res,
        });
        localStorage.setItem(
          'customers',
          JSON.stringify(this.#stateCustomers().customers)
        );
      },
      (error) => {
        this.#stateCustomers.set({
          loadingCustomers: false,
          customers: [],
        });
      }
    );
  }

  public deleteUser(id: number) {
    return this.http.delete(`${this.env.url_api}/customers/${id}`).pipe(
      tap((_) => {
        this.#stateCustomers.set({
          loadingCustomers: false,
          customers: this.customers().filter((i) => i.id_customer !== id),
        });
        this.saveStorageCustomers(this.#stateCustomers().customers);
      })
    );
  }

  public updateUser(id: number, user: Partial<Customer>) {
    if (this.customer()!.id_customer === id) {
      const updateCustomer = { ...this.customer()!, ...user };
      localStorage.setItem('customer', JSON.stringify(updateCustomer));
      this.#state.set({
        loading: false,
        customer: updateCustomer,
        token: localStorage.getItem('token')!,
      });
    }
    return this.http.patch<Customer>(`${this.env.url_api}/customers/${id}`, user).pipe(
      tap((resCustomer) => {
        const oldCustomer = this.#stateCustomers().customers;
        const index = oldCustomer.findIndex(
          (i) => i.id_customer === resCustomer.id_customer
        );
        oldCustomer[index] = resCustomer;
        this.#stateCustomers.set({
          loadingCustomers: false,
          customers: oldCustomer,
        });
        this.saveStorageCustomers(this.#stateCustomers().customers);
      })
    );
  }
}
