import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import moment from 'moment';
import {
  DailyReport,
  FinancialSummary,
  NewClientsSummary,
  OrderSummaryByMode,
} from '@interfaces/reports';

interface StateDailyReport {
  dailyReport: DailyReport | null;
  loadingDailyReport: boolean;
}

interface StateOrdersSummary {
  ordersSummary: OrderSummaryByMode | null;
  loadingOrdersSummary: boolean;
}

interface StateFinancialSummary {
  financialSummary: FinancialSummary | null;
  loadingFinancialSummary: boolean;
}

interface StateNewClients {
  newClientsSummary: NewClientsSummary | null;
  loadingNewClients: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private http = inject(HttpClient);
  #state = signal<StateDailyReport>({
    dailyReport: null,
    loadingDailyReport: true,
  });

  #stateOrdersSummary = signal<StateOrdersSummary>({
    ordersSummary: null,
    loadingOrdersSummary: true,
  });

  #stateFinancialSumary = signal<StateFinancialSummary>({
    financialSummary: null,
    loadingFinancialSummary: true,
  });

  #stateNewClients = signal<StateNewClients>({
    newClientsSummary: null,
    loadingNewClients: true,
  });

  public dailyReport = computed(() => this.#state().dailyReport);
  public loadingDailyReport = computed(() => this.#state().loadingDailyReport);

  public ordersSummary = computed(
    () => this.#stateOrdersSummary().ordersSummary
  );
  public loadingOrdersSummary = computed(
    () => this.#stateOrdersSummary().loadingOrdersSummary
  );

  public financialSummary = computed(
    () => this.#stateFinancialSumary().financialSummary
  );
  public loadingFinancialSummary = computed(
    () => this.#stateFinancialSumary().loadingFinancialSummary
  );

  public newClientsSummary = computed(
    () => this.#stateNewClients().newClientsSummary
  );
  public loadingNewClients = computed(
    () => this.#stateNewClients().loadingNewClients
  );

  constructor() {}

  public getDailyReport(dateStart: Date, dateEnd: Date): void {
    const filterStart = moment(dateStart).format('YYYY-MM-DD');
    const filterEnd = moment(dateEnd).format('YYYY-MM-DD');

    this.#state.set({
      loadingDailyReport: true,
      dailyReport: this.#state().dailyReport,
    });
    this.http
      .get<DailyReport>(
        `${environment.url_api}/reports/dailyReport/${filterStart}/${filterEnd}`
      )
      .subscribe(
        (res) => {
          this.#state.set({
            loadingDailyReport: false,
            dailyReport: res,
          });
        },
        (error) => {
          this.#state.set({
            loadingDailyReport: false,
            dailyReport: null,
          });
        }
      );
  }

  public getOrdersSummary(dateStart: Date, dateEnd: Date): void {
    const filterStart = moment(dateStart).format('YYYY-MM-DD');
    const filterEnd = moment(dateEnd).format('YYYY-MM-DD');

    this.#stateOrdersSummary.set({
      loadingOrdersSummary: true,
      ordersSummary: this.#stateOrdersSummary().ordersSummary,
    });

    console.log('fechas de filtro', filterStart, filterEnd);

    this.http
      .get<OrderSummaryByMode>(
        `${environment.url_api}/reports/ordersSummary/${filterStart}/${filterEnd}`
      )
      .subscribe(
        (res) => {
          this.#stateOrdersSummary.set({
            loadingOrdersSummary: false,
            ordersSummary: res,
          });
        },
        (error) => {
          this.#stateOrdersSummary.set({
            loadingOrdersSummary: false,
            ordersSummary: null,
          });
        }
      );
  }

  public getFinnacialSummary(period: 'monthly' | 'weekly' | 'daily'): void {
    this.#stateFinancialSumary.set({
      financialSummary: this.#stateFinancialSumary().financialSummary,
      loadingFinancialSummary: true,
    });

    this.http
      .get<FinancialSummary>(
        `${environment.url_api}/reports/financialSummary/${period}`
      )
      .subscribe(
        (res) => {
          this.#stateFinancialSumary.set({
            financialSummary: res,
            loadingFinancialSummary: false,
          });
          console.log(res);
        },
        (error) => {
          this.#stateFinancialSumary.set({
            financialSummary: null,
            loadingFinancialSummary: false,
          });
        }
      );
  }

  public getNewClientsSummary(period: 'monthly' | 'weekly' | 'daily'): void {
    this.#stateNewClients.set({
      newClientsSummary: this.#stateNewClients().newClientsSummary,
      loadingNewClients: true,
    });

    this.http
      .get<NewClientsSummary>(
        `${environment.url_api}/reports/newClients/${period}`
      )
      .subscribe(
        (res) => {
          this.#stateNewClients.set({
            newClientsSummary: res,
            loadingNewClients: false,
          });
          console.log(res);
        },
        (error) => {
          this.#stateNewClients.set({
            newClientsSummary: null,
            loadingNewClients: false,
          });
        }
      );
  }
}
