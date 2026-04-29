import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class SubjectService {
  private apiUrl = environment.API_SUBJECT;
  constructor(private http: HttpClient) {}
  //Get all
  // GET all
  getAll(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  // POST add
  add(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  // DELETE
  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // UPDATE
  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }
}
