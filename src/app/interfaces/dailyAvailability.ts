import { Items } from './items';

export interface DailyAvailability {
  id_daily_availability: number;
  itemIdItem: number;
  quantity: number;
  sold: number,
  date: string;
  item?: Items;
}
