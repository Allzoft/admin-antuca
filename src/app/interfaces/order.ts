import { Client } from './client';
import { Customer } from './customer';
import { Items } from './items';
import { PaymentType } from './paymentType';
import { Restaurant } from './restaurant';
import { State } from './state';

export enum ServiceMode {
  EN_SALA = 'En Sala',
  PARA_LLEVAR = 'Para llevar',
  DELIVERY = 'Delivery',
  MIXTO = 'Mixto',
}

export interface Order {
  id_order: number;
  customerIdCustomer: number;
  clientIdClient: number;
  restaurantIdRestaurant?: number;
  date: string;
  stateIdState: number;
  total_amount: number;
  paymentTypeIdPaymentType: number;
  service_mode: ServiceMode;
  notes: string;
  items?: createItems[];
  created_at?: Date;
  updated_at?: Date;
  orderItems?: OrderItems[];
  client?: Client;
  customer?: Customer;
  state?: State;
  paymentType?: PaymentType;
  restaurant?: Restaurant;
}

export interface OrderItems {
  id_order_item: number;
  orderIdOrder: number;
  itemIdItem: number;
  quantity: number;
  item: Items;
}

export interface createItems {
  itemIdItem: number;
  quantity: number;
}
