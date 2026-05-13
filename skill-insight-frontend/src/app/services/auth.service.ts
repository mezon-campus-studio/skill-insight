import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly AUTH_API = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  // MEZON SERVICE
  loginWithMezon(): void {
    this.http.get<any>(`${environment.Auth_Mezon}`).subscribe((res) => {
      window.location.href = res.url;
    });
  }

  login(data: any): Observable<any> {
    return this.http
      .post(`${this.AUTH_API}/login`, data, {
        withCredentials: true,
      })
      .pipe(
        tap((res: any) => {
          if (res?.success && res?.user) {
            this.saveUser(res.user);
            if (res.token) localStorage.setItem('access_token', res.token);
          }
        }),
      );
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.AUTH_API}/register`, data, {
      withCredentials: true,
    });
  }

  getMe(): Observable<any> {
    return this.http
      .get(`${this.AUTH_API}/me`, {
        withCredentials: true,
      })
      .pipe(
        tap((res: any) => {
          if (res?.success && res?.user) {
            this.saveUser(res.user);
            if (res.token) {
              localStorage.setItem('access_token', res.token);
            }
          }
        }),
        catchError((err) => {
          if (err.status === 401) {
            this.clearUser();
            localStorage.removeItem('access_token');
          }
          return throwError(() => err);
        }),
      );
  }
  updateRole(data: { userId: number; role: string }): Observable<any> {
    return this.http
      .post(`${this.AUTH_API}/update-role`, data, {
        withCredentials: true,
      })
      .pipe(
        tap((res: any) => {
          if (res?.success && res?.user) {
            this.saveUser(res.user);
          }
        }),
      );
  }

  updateProfile(data: any): Observable<any> {
    return this.http
      .put<any>(`${this.AUTH_API}/profile`, data, {
        withCredentials: true, // chỉ giữ nếu bạn dùng cookie auth
      })
      .pipe(
        tap((res) => {
          if (res?.success && res?.user) {
            this.saveUser(res.user);
          }
        }),
        catchError((err) => {
          console.error('Update profile failed:', err);

          // xử lý 401 token hết hạn
          if (err?.status === 401) {
            this.logout?.(); // nếu bạn có hàm logout
          }

          return throwError(() => err);
        }),
      );
  }

  getUser(): any {
    const user = localStorage.getItem('user');
    try {
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  saveUser(user: any): void {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  clearUser(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('access_token');
  }

  logout(): void {
    this.http
      .post(
        `${this.AUTH_API}/logout`,
        {},
        {
          withCredentials: true,
        },
      )
      .subscribe({
        next: () => this.handleLocalLogout(),
        error: () => this.handleLocalLogout(),
      });
  }

  private handleLocalLogout(): void {
    this.clearUser();
    window.location.href = '/login';
  }

  deleteAccount(): Observable<any> {
    return this.http.delete(`${this.AUTH_API}/me`, {
      withCredentials: true,
    });
  }
}
