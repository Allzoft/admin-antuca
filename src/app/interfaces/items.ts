import { DailyAvailability } from './dailyAvailability';
import { Restaurant } from './restaurant';

export interface Items {
  id_item: number;
  name: string;
  description: string;
  type_item: TypeItem;
  photo: string;
  price: number;
  restaurantIdRestaurant?: number;
  dailyAvailabilities?: DailyAvailability[];
  restaurant?: Restaurant;
}

export enum TypeItem {
  SOPA = 'Sopa',
  SEGUNDO = 'Segundo',
  BEBIDA = 'Bebida',
  OTRO = 'Otro',
}