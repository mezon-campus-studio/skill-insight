import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Router } from '@angular/router';
Router;
@Component({
  selector: 'app-callback',
  imports: [],
  templateUrl: './callback.html',
  styleUrl: './callback.css',
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
    //check state
    if (!state || state !== savedState) {
      console.error('invalid state');
      return;
    }
    //remove state
    sessionStorage.removeItem('oauth_state');
    if (!code) {
      console.error('Không có code');
      return;
    }
    // call backend
    this.http
      .post(`${environment.apiUrl}/mezon/callback`, {
        code: code,
        state: state,
      })
      .subscribe({
        next: (res: any) => {
          localStorage.setItem('user', JSON.stringify(res.user));
          // turn page
          this.router.navigate(['/home']);
        },
        error: (err) => {
          console.error('Lỗi API:', err);
          this.router.navigate(['/login']);
        },
      });
  }
}
