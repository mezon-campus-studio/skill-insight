import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-callback',
  imports: [],
  templateUrl: './callback.html',
  styleUrl: './callback.css',
})
export class CallbackComponent implements OnInit {
  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const params = new URLSearchParams(window.location.search);

    const code = params.get('code');
    const state = params.get('state');

    console.log('CODE:', code);
    console.log('STATE:', state);

    if (!code) {
      console.error('Không có code');
      return;
    }

    // Gọi backend
    this.http
      .post('http://localhost:3000/auth/mezon/callback', {
        code: code,
      })
      .subscribe({
        next: (res: any) => {
          console.log('USER:', res);

          localStorage.setItem('user', JSON.stringify(res.user));

          // chuyển trang
          window.location.href = '/';
        },
        error: (err) => {
          console.error('Lỗi API:', err);
        },
      });
  }
}
