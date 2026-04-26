import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.html',
})
export class CallbackComponent implements OnInit {
  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  ngOnInit(): void {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');
    const savedState = sessionStorage.getItem('oauth_state');

    // check state
    if (!state || state !== savedState) {
      console.error('invalid state');
      this.router.navigate(['/login']);
      return;
    }

    sessionStorage.removeItem('oauth_state');

    if (!code) {
      console.error('Không có code');
      this.router.navigate(['/login']);
      return;
    }

    this.http
      .post(`${environment.apiUrl}/mezon/callback`, {
        code,
        state,
      })
      .subscribe({
        next: (res: any) => {
          // save user + token
          localStorage.setItem('user', JSON.stringify(res.user));
          localStorage.setItem('token', res.token);
          // clear URL
          window.history.replaceState({}, document.title, '/callback');
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Lỗi API:', err);
          this.router.navigate(['/login']);
        },
      });
  }
}
