import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { finalize } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {

  email = '';
  password = '';

  showPassword = false;
  remember = false; 
  loading = false;
  error = '';

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  // ======================
  // LOGIN
  // ======================
  onLogin() {

    if (this.loading) return;

    this.error = '';

    if (!this.email || !this.password) {
      this.error = 'Vui lòng nhập email và mật khẩu';
      return;
    }

    this.loading = true;

    this.auth.login({
      email: this.email,
      password: this.password
    })
    .pipe(finalize(() => this.loading = false))
    .subscribe({
      next: (res: any) => {

        const token = res?.data?.token;
        const user = res?.data?.user;

        if (!token || !user) {
          this.error = 'Thiếu dữ liệu từ server';
          return;
        }

        this.auth.saveAuth({ token, user });

        if (user.role === 'admin') {
          this.router.navigate(['/dashboard']);
          return;
        }

        if (!user.role) {
          this.router.navigate(['/select-role']);
          return;
        }

        this.router.navigate(['/dashboard']);
      },

      error: (err) => {
        this.error =
          err?.error?.message ||
          err?.error?.error ||
          'Đăng nhập thất bại';
      }
    });
  }

  // ======================
  // NAVIGATION
  // ======================
  goRegister() {
    this.router.navigate(['/register']);
  }

  goForgot() {
    alert('Chức năng quên mật khẩu chưa hỗ trợ');
  }

  // ======================
  // UI
  // ======================
  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}