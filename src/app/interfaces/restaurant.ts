import { Client } from "./client";
import { Customer } from "./customer";
import { DailyAvailability } from "./dailyAvailability";
import { Items } from "./items";
import { Order } from "./order";

export enum TypeSubscription {
  BASIC = 'BASIC',
  PREMIUM = 'PREMIUM',
}

export interface Restaurant {
  id_restaurant: number;
  name: string;
  logo_image: string;
  is_enabled: number;
  phone_number: string;
  code_country: string;
  address: string;
  owner: string;
  owner_phone: string;
  category: string;
  max_capacity: number;
  schedule: string;
  subscription: TypeSubscription;
  type_cuisine: string;
  primary_color: string;
  secondary_color: string;
  allow_notifications: number;
  created_at?: Date;
  updated_at?: Date;
  customers?: Customer[];
  clients?: Client[];
  orders?: Order[];
  items?: Items[];
  dailyAvailabilities?: DailyAvailability[];
}
