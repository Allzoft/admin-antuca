export interface Client {
  id_client: number;
  name: string;
  lastname: string;
  email: string;
  photo: string;
  code_country: string;
  phone: string;
  id: string;
  type_business: number;
  gender: string;
  info: string;
  google: number;
  created_at?: Date;
  updated_at?: Date;
}
