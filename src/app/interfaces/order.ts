import { Client } from './client';
import { Customer } from './customer';
import { Items } from './items';
import { PaymentType } from './paymentType';
import { State } from './state';

export interface Order {
  id_order: number;
  customerIdCustomer: number;
  clientIdClient: number;
  date: Date;
  stateIdState: number;
  total_amount: number;
  paymentTypeIdPaymentType: number;
  notes: string;
  items?: createItems[];
  created_at?: Date;
  updated_at?: Date;
  orderItems?: OrderItems[];
  client: Client;
  customer: Customer;
  state: State;
  paymentType: PaymentType;
}

export interface OrderItems {
  id_order_item: number;
  orderIdOrder: number;
  itemIdItem: number;
  quantity: number;
  subtotal: number;
  item: Items;
}

export interface createItems {
  itemIdItem: number;
  quantity: number;
  subtotal: number;
}
