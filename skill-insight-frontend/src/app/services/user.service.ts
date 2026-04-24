import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API = 'http://localhost:3000/api/users';

  constructor(
    private http: HttpClient
  ) {}

  // ======================
  // GET USERS (PAGINATION + SEARCH)
  // ======================
  getUsers(
    page: number = 1,
    limit: number = 25,
    keyword: string = ''
  ): Observable<any> {

    const token = localStorage.getItem('token');

    return this.http.get(
      `${this.API}?page=${page}&limit=${limit}&keyword=${keyword}&t=${Date.now()}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  // ======================
  // CREATE USER
  // ======================
  createUser(data: any): Observable<any> {

    const token = localStorage.getItem('token');

    return this.http.post(
      this.API,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  // ======================
  // UPDATE ROLE
  // ======================
  updateRole(
    userId: number,
    role: string
  ): Observable<any> {

    const token = localStorage.getItem('token');

    return this.http.put(
      `${this.API}/${userId}/role`,
      { role },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }

  // ======================
  // DELETE USER
  // ======================
  deleteUser(
    userId: number
  ): Observable<any> {

    const token = localStorage.getItem('token');

    return this.http.delete(
      `${this.API}/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
  }
}