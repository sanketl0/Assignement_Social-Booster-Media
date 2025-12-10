import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = `${environment.apiUrl}/tasks/`;

  constructor(private http: HttpClient) {}

  getTasks() {
    return this.http.get(this.apiUrl);
  }

  createTask(data: any) {
    return this.http.post(this.apiUrl, data);
  }

  updateTask(id: number, data: any) {
    return this.http.put(`${this.apiUrl}${id}/`, data);
  }

  deleteTask(id: number) {
    return this.http.delete(`${this.apiUrl}${id}/`);
  }
}
