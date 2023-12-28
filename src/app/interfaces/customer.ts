export interface Customer {
  id_customer: number;
  name: string;
  lastname: string;
  id: string;
  email: string;
  password?: string;
  token: string;
  code_country: string;
  phone: string;
  photo: string;
  status?: number;
  created_at?: Date;
  updated_at?: Date;
}

export interface CustomerResponse {
  access_token: string;
  customer: Customer;
}

export interface CustomerLogin {
  email: string;
  password: string;
}
