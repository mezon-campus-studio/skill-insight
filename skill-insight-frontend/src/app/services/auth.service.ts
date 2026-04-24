import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  // ===== LOGIN =====
  login(data: { email: string; password: string }) {
    return this.http.post(`${this.API}/login`, data);
  }

  // ===== REGISTER =====
  register(data: any) {
    return this.http.post(`${this.API}/register`, data);
  }

  // ===== SAVE AUTH =====
  saveAuth(data: any): void {
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.clear();
  }

  // ===== UPDATE ROLE =====
  updateRole(role: string) {
    return this.http.put(
      'http://localhost:3000/api/users/update-role',
      { role }
    );
  }
}