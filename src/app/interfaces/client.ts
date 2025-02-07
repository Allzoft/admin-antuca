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
  restaurantIdRestaurant?: number;
  gender: Gender.MASCULINO;
  info: string;
  google: number;
  created_at?: Date;
  updated_at?: Date;
  restaurant?: number 
}


export enum TypeBusiness {
  B2B = 'B2B',
  B2C = 'B2C',
}

export enum Gender {
  MASCULINO = 'Masculino',
  FEMENINO = 'Femenino',
  OTRO = 'Otro',
}
