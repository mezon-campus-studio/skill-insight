import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API = '/api/users';

  constructor(
    private http: HttpClient
  ) {}

  getUsers(
    page: number = 1,
    limit: number = 25,
    keyword: string = ''
  ): Observable<any> {

    return this.http.get(
      `${this.API}?page=${page}&limit=${limit}&keyword=${keyword}&t=${Date.now()}`,
      {
        withCredentials: true
      }
    );
  }

  createUser(data: any): Observable<any> {

    return this.http.post(
      this.API,
      data,
      {
        withCredentials: true
      }
    );
  }

  updateRole(
    userId: number,
    role: string
  ): Observable<any> {

    return this.http.put(
      `${this.API}/${userId}/role`,
      { role },
      {
        withCredentials: true
      }
    );
  }

  deleteUser(
    userId: number
  ): Observable<any> {

    return this.http.delete(
      `${this.API}/${userId}`,
      {
        withCredentials: true
      }
    );
  }
}