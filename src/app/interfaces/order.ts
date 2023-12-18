export interface Order {
  id_order: number;
  customerIdCustomer: number;
  clientIdClient: number;
  date: Date;
  stateIdState: number;
  total_amount: number;
  paymentTypeIdPaymentType: number;
  notes: string;
}
