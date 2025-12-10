import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  constructor(private http: HttpClient) {}

  getTaskReport() {
    return this.http.get(`${environment.apiUrl}/reports/tasks/`);
  }

  getWeatherReport() {
    return this.http.get(`${environment.apiUrl}/reports/weather/`);
  }
}
