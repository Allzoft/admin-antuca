import { Injectable, computed, inject, signal } from '@angular/core';
import { environment } from '@environment/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import moment from 'moment';
import { DailyReport } from '@interfaces/reports';

interface StateDailyReport {
  dailyReport: DailyReport | null;
  loadingDailyReport: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private http = inject(HttpClient);
  #state = signal<StateDailyReport>({
    loadingDailyReport: true,
    dailyReport: null,
  });

  public dailyReport = computed(() => this.#state().dailyReport);
  public loadingDailyReport = computed(() => this.#state().loadingDailyReport);

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
}
