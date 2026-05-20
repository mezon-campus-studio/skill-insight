import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-oauth-success',
  standalone: true,
  template: `
    <div class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <p class="text-lg font-medium">Đang xử lý đăng nhập...</p>
        <p class="text-sm text-gray-500">Vui lòng đợi trong giây lát</p>
      </div>
    </div>
  `
})
export class OauthSuccessComponent implements OnInit {

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit(): void {

    const params = new URLSearchParams(window.location.search);
    const token = params.get('token'); 
    const needSetPassword = params.get('needSetPassword');

    console.log('🔍 [OAuth Success] Params:', { hasToken: !!token, needSetPassword });

    if (token) {
      localStorage.setItem('access_token', token);
    }

    this.http.get<any>(`${environment.apiUrl}/auth/me`, {
      withCredentials: true
    }).subscribe({
      next: (res) => {
        console.log('RESPONSE /me:', res);

        const user = res?.user;

        if (!user) {
          this.router.navigate(['/login']);
          return;
        }

        localStorage.setItem('user', JSON.stringify(user));

        window.history.replaceState({}, document.title, window.location.pathname);

        if (needSetPassword === 'true' || user.hasPassword === false) {
          this.router.navigate(['/set-password']);
          return;
        }

        if (!user.role) {
          this.router.navigate(['/select-role']);
          return;
        }

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('GET /me ERROR:', err);

        localStorage.removeItem('user');
        localStorage.removeItem('access_token');
        this.router.navigate(['/login']);
      }
    });
  }
}
