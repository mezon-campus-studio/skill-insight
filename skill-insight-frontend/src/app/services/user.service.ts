import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private API = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient) {}

  // ======================
  // GET USERS (PAGINATION)
  // ======================
  getUsers(
    page: number = 1,
    limit: number = 25
  ): Observable<any> {
    return this.http.get(
      `${this.API}?page=${page}&limit=${limit}`
    );
  }

  // ======================
  // UPDATE ROLE
  // ======================
  updateRole(
    userId: number,
    role: string
  ): Observable<any> {
    return this.http.put(
      `${this.API}/update-role`,
      { userId, role }
    );
  }

}