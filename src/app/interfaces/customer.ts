import { Restaurant } from './restaurant';
import { Role } from './role';

export interface Customer {
  id_customer: number;
  name: string;
  lastname: string;
  id: string;
  email: string;
  password?: string;
  token: string;
  code_country: string;
  roleIdRole: number;
  restaurantIdRestaurant: number;
  phone: string;
  photo: string;
  status?: number;
  created_at?: Date;
  updated_at?: Date;
  role?: Role;
  restaurant?: Restaurant
}

export interface CustomerResponse {
  access_token: string;
  customer: Customer;
}

export interface CustomerLogin {
  email: string;
  password: string;
}

export interface MenuItem {
  id_access: number;
  name: string;
  icon: string;
  link: string;
  section: string;
  father: string;
  position: string;
  isSelect: boolean;
}
