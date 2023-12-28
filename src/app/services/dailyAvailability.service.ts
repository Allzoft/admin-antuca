import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { environment } from '@environment/environment';
import { DailyAvailability } from '@interfaces/dailyAvailability';
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
    dateStart: string,
    dateEnd: string
  ): Observable<DailyAvailability[]> {
    return this.http.get<DailyAvailability[]>(
      `${environment.url_api}/daily-availability/bydates/${dateStart}/${dateEnd}`
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
