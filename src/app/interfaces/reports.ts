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

export interface FinancialSummaryByMonth {
  total_incomes: number;
  total_outcomes: number;
  incomes_by_month: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ];
  outcomes_by_month: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ];
}

export interface FinancialSumaryByWeek {
  total_incomes: number;
  total_outcomes: number;
  incomes_by_week: [number, number, number, number];
  outcomes_by_week: [number, number, number, number];
}

export interface FinancialSumaryByDay {
  total_incomes: number;
  total_outcomes: number;
  incomes_by_day: [number, number, number, number, number, number, number];
  outcomes_by_day: [number, number, number, number, number, number, number];
}

export interface NewClientsByMonth {
  new_clients_by_month: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ];
}

export interface NewClientsByWeek {
  new_clients_by_week: [
    number,
    number,
    number,
    number,
    number,
    number,
    number,
    number
  ];
}

export interface NewClientsByDay {
  new_clients_by_day: [number, number, number, number, number, number, number];
}

export interface OrderSumaryByMode {
  total_orders: number;
  orders_by_delivery: number;
  orders_by_pickup: number;
  orders_by_table: number;
}
