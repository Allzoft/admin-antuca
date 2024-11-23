import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environment/environment';
import { DailyAvailability } from '@interfaces/dailyAvailability';
import moment from 'moment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DailyAvailabilityServices {
  private http = inject(HttpClient);

  getAllDailyAvailability(): Observable<DailyAvailability[]> {
    return this.http.get<DailyAvailability[]>(
      `${environment.url_api}/daily-availability`
    );
  }

  getAllByDatesDailyAvailability(
    dateStart: Date,
    dateEnd: Date
  ): Observable<DailyAvailability[]> {
    const filterStart = moment(dateStart).format('YYYY-MM-DD');
    const filterEnd = moment(dateEnd).format('YYYY-MM-DD');
    return this.http.get<DailyAvailability[]>(
      `${environment.url_api}/daily-availability/bydates/${filterStart}/${filterEnd}`
    );
  }

  postDailyAvailability(obj: any): Observable<DailyAvailability> {
    return this.http.post<DailyAvailability>(
      `${environment.url_api}/daily-availability`,
      obj
    );
  }

  updateDailyAvailability(
    id: number,
    data: any
  ): Observable<DailyAvailability> {
    return this.http.patch<DailyAvailability>(
      `${environment.url_api}/daily-availability/${id}`,
      data
    );
  }

  deleteDailyAvailability(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${environment.url_api}/daily-availability/${id}`
    );
  }
}
