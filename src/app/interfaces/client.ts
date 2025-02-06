export interface Client {
  id_client: number;
  name: string;
  lastname: string;
  email: string;
  photo: string;
  code_country: string;
  phone: string;
  id: string;
  type_business: TypeBusiness;
  gender: string;
  info: string;
  google: number;
  created_at?: Date;
  updated_at?: Date;
}


export enum TypeBusiness {
  B2B = 'B2B',
  B2C = 'B2C',
}

