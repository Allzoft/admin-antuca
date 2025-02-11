export interface DailyReport {
  total_menus: number;
  weeklyGrowthRate_menus: number;
  total_incomes: number;
  weeklyGrowthRate_incomes: number;
  total_orders: number;
  weeklyGrowthRate_orders: number;
  total_customers: number;
  weeklyGrowthRate_customers: number;
}

export interface FinancialSummary {
  total_income: number;
  total_outcome: number;
  incomes: number[];
  outcomes: number[];
  labels: string[];
}

export interface NewClientsSummary {
  total_clients: number;
  clients_value: number[];
  labels: string[];
}

export interface OrderSummaryByMode {
  total_orders: number;
  orders_by_delivery: number;
  orders_by_pickup: number;
  orders_by_table: number;
  orders_by_mix: number;
}
