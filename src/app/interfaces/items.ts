export interface Items {
  id_item: number;
  name: string;
  description: string;
  type_item: number | { code: number; label: string };
  photo: string;
  price: number;
  available: number;
}
