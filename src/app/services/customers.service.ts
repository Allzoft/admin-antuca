import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import {
  Customer,
  CustomerLogin,
  CustomerResponse,
  MenuItem,
} from '@interfaces/customer';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '@environment/environment';
import { Restaurant } from '@interfaces/restaurant';
import { ThemeService } from './theme.service';

interface State {
  customer: Customer | undefined;
  token: string | undefined;
  access: MenuItem[];
  restaurant: Restaurant | undefined;
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
  private themeService = inject(ThemeService);
  private router = inject(Router);

  public env = environment;

  private http = inject(HttpClient);
  #state = signal<State>({
    loading: true,
    customer: undefined,
    access: [],
    token: undefined,
    restaurant: undefined,
  });

  #stateCustomers = signal<StateCustomers>({
    loadingCustomers: true,
    customers: [],
  });

  public customer = computed(() => this.#state().customer);
  public loading = computed(() => this.#state().loading);
  public token = computed(() => this.#state().token);
  public access = computed(() => this.#state().access);
  public restaurant = computed(() => this.#state().restaurant);

  public customers = computed(() => this.#stateCustomers().customers);
  public loadingCustomers = computed(
    () => this.#stateCustomers().loadingCustomers
  );

  constructor() {
    this.loadStorage();
    if (this.customer()) {
      setTimeout(() => {
        this.getOneUser(this.customer()?.id_customer!).subscribe((res) => {
          const restaurant = res.restaurant!;
          const colorPrimary = restaurant.primary_color;
          const colorSecondary = restaurant.secondary_color;
          if (colorPrimary) {
            this.themeService.changeThemeColors('primary', colorPrimary);
          }
          if (colorSecondary) {
            this.themeService.changeThemeColors('secondary', colorSecondary);
          }
        });
      }, 3000);
    }
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
            access: res.customer.role!.access,
            restaurant: res.customer.restaurant!,
          });

          this.changeTheme(res.customer.restaurant!);
        })
      );
  }

  private saveStorage(resCustomer: CustomerResponse) {
    localStorage.setItem('customer', JSON.stringify(resCustomer.customer));
    localStorage.setItem(
      'restaurant',
      JSON.stringify(resCustomer.customer.restaurant)
    );
    localStorage.setItem(
      'access',
      JSON.stringify(resCustomer.customer.role!.access)
    );
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
        restaurant: JSON.parse(localStorage.getItem('restaurant')!),
        token: localStorage.getItem('token')!,
        access: JSON.parse(localStorage.getItem('access')!),
      });
      if (this.router.url.includes('/auth')) {
        this.router.navigateByUrl('/dashboard');
      }
    } else {
      this.#state.set({
        loading: true,
        customer: undefined,
        restaurant: undefined,
        token: undefined,
        access: [],
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
    localStorage.removeItem('restaurant');
    this.#state.set({
      loading: true,
      customer: undefined,
      restaurant: undefined,
      token: undefined,
      access: [],
    });
    this.router.navigateByUrl('/auth');
    this.themeService.setDefaultTheme();
  }

  public postCustomer(customer: Partial<Customer>): Observable<Customer> {
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

  public getOneUser(id: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.env.url_api}/customers/${id}`);
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
        access: JSON.parse(localStorage.getItem('access')!),
        restaurant: JSON.parse(localStorage.getItem('restaurant')!),
      });
    }
    return this.http
      .patch<Customer>(`${this.env.url_api}/customers/${id}`, user)
      .pipe(
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

  public refreshRestaurant(restaurant: Restaurant) {
    const updateRestaurant = { ...this.restaurant()!, ...restaurant };
    this.#state.set({
      loading: false,
      access: this.#state().access,
      customer: this.#state().customer,
      token: this.#state().token,
      restaurant: updateRestaurant,
    });
    localStorage.setItem('restaurant', JSON.stringify(updateRestaurant));
  }

  public changeTheme(restaurant: Restaurant) {
    const colorPrimary = restaurant.primary_color;
    const colorSecondary = restaurant.secondary_color;
    if (colorPrimary) {
      this.themeService.changeThemeColors('primary', colorPrimary);
    }
    if (colorSecondary) {
      this.themeService.changeThemeColors('secondary', colorSecondary);
    }
  }
}
