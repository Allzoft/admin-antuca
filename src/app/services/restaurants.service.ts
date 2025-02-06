import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';

import { Observable, tap } from 'rxjs';
import { environment } from '@environment/environment';
import { Restaurant } from '@interfaces/restaurant';

interface State {
  restaurants: Restaurant[];
  loading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class RestaurantsService {
  public env = environment;

  private http = inject(HttpClient);
  #state = signal<State>({
    loading: true,
    restaurants: [],
  });

  public restaurants = computed(() => this.#state().restaurants);
  public loading = computed(() => this.#state().loading);

  constructor() {
    this.loadStorage();
  }

  private saveStorage(restaurant: Restaurant[]) {
    if (restaurant.length > 0) {
      localStorage.setItem('restaurants', JSON.stringify(this.#state().restaurants));
    } else {
      localStorage.removeItem('restaurants');
    }
  }

  private loadStorage() {
    if (localStorage.getItem('restaurants')) {
      this.#state.set({
        loading: false,
        restaurants: JSON.parse(localStorage.getItem('restaurants')!),
      });
    } else {
      this.getRestaurant();
    }
  }

  public postRestaurant(restaurant: Partial<Restaurant>): Observable<Restaurant> {
    return this.http.post<Restaurant>(`${this.env.url_api}/restaurants`, restaurant).pipe(
      tap((resRestaurant) => {
        const oldRestaurant = this.#state().restaurants;
        oldRestaurant.push(resRestaurant);
        this.#state.set({
          loading: false,
          restaurants: oldRestaurant,
        });
        this.saveStorage(this.#state().restaurants);
      })
    );
  }

  public getRestaurant(): void {
    this.#state.set({
      loading: true,
      restaurants: this.#state().restaurants,
    });
    this.http.get<Restaurant[]>(`${this.env.url_api}/restaurants`).subscribe(
      (res) => {
        this.#state.set({
          loading: false,
          restaurants: res,
        });
        localStorage.setItem('restaurants', JSON.stringify(this.#state().restaurants));
      },
      (error) => {
        this.#state.set({
          loading: false,
          restaurants: [],
        });
      }
    );
  }


  public updateRestaurant(id: number, restaurant: Partial<Restaurant>): Observable<Restaurant> {
    return this.http
      .patch<Restaurant>(`${this.env.url_api}/restaurants/${id}`, restaurant)
      .pipe(
        tap((resRestaurant) => {
          const oldRestaurant = this.#state().restaurants;
          const index = oldRestaurant.findIndex(
            (i) => i.id_restaurant === resRestaurant.id_restaurant
          );
          oldRestaurant[index] = resRestaurant;
          this.#state.set({
            loading: false,
            restaurants: oldRestaurant,
          });
          this.saveStorage(this.#state().restaurants);
        })
      );
  }

  public deleteRestaurant(id: number) {
    return this.http.delete(`${this.env.url_api}/restaurants/${id}`).pipe(
      tap((_) => {
        this.#state.set({
          loading: false,
          restaurants: this.restaurants().filter((i) => i.id_restaurant !== id),
        });
        this.saveStorage(this.#state().restaurants);
      })
    );
  }

  public updateRestaurants(restaurant: Restaurant[]) {
    this.#state.set({
      loading: false,
      restaurants: restaurant,
    });
  }
}
