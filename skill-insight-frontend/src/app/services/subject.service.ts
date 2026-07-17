import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubjectService {

  private apiUrl = environment.api.subjects;

  constructor(private http: HttpClient) {}

  // GET ALL + SEARCH + PAGINATION
  getAll(
    page: number = 1,
    limit: number = 5,
    search: string = '',
    dateMode: string = '',
    fromDate: string = '',
    toDate: string = ''
  ): Observable<any> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString())
      .set('search', search)
      .set('t', Date.now().toString());

    if (dateMode) {
      params = params.set('dateMode', dateMode);
    }

    if (fromDate) {
      params = params.set('fromDate', fromDate);
    }

    if (toDate) {
      params = params.set('toDate', toDate);
    }

    return this.http.get(this.apiUrl, {
      params,
      withCredentials: true
    });
  }

  getAllSubjects(): Observable<any> {

  return this.http.get(
    `${this.apiUrl}/all`,
    {
      withCredentials: true
    }
  );

}
  // ADD
  add(data: any): Observable<any> {

    return this.http.post(this.apiUrl, data, {
      withCredentials: true
    });

  }

  // ADD BULK
  addBulk(data: any[]): Observable<any> {

    return this.http.post(`${this.apiUrl}/bulk`, data, {
      withCredentials: true
    });

  }
  
  // CREATE SUBJECT

createSubject(
  data: any
): Observable<any> {

  return this.http.post(
    this.apiUrl,
    data,
    {
      withCredentials: true
    }
  );

}

  // UPDATE
  update(id: number, data: any): Observable<any> {

    return this.http.put(`${this.apiUrl}/${id}`, data, {
      withCredentials: true
    });

  }

  // DELETE ONE
  delete(id: number): Observable<any> {

    return this.http.delete(`${this.apiUrl}/${id}`, {
      withCredentials: true
    });

  }

  // DELETE MULTIPLE
  deleteMultiple(ids: number[]): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/delete-multiple`,
      { ids },
      {
        withCredentials: true
      }
    );

  }

  // DELETE ALL
  deleteAll(): Observable<any> {

    return this.http.delete(this.apiUrl, {
      withCredentials: true
    });

  }

}