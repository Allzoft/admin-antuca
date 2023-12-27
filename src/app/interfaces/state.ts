export interface State {
  id_state: number;
  name: string;
  type: string;
  priority: number;
  color: 'success' | 'info' | 'warning' | 'danger' | undefined;
  status?: number;
  created_at?: Date;
  updated_at?: Date;
}
