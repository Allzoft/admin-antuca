export interface State {
  id_state: number;
  name: string;
  type: string;
  priority: number;
  color: string;
  status?: number;
  created_at?: Date;
  updated_at?: Date;
}
