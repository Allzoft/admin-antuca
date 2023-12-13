import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root',
})
export class UploadService {
  constructor(private http: HttpClient) {}

  uploadfile(data: any) {
    return this.http.post<any>(`${environment.url_api}/upload/`, data);
  }
}
