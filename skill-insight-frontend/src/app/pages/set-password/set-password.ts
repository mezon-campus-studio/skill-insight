
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-set-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './set-password.html',
  styleUrls: ['./set-password.css']
})
export class SetPasswordComponent {

  password = '';
  confirmPassword = '';
  error = '';
  loading = false;

  showPassword = false;
  showConfirmPassword = false;

  user: any;

  hasMinLength = false;
  hasUppercase = false;
  hasNumber = false;
  hasSpecial = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    const userStr = localStorage.getItem('user');
    this.user = userStr ? JSON.parse(userStr) : null;

    if (!this.user?.userId) {
      this.router.navigate(['/login']);
    }
  }

  checkPassword() {
    this.hasMinLength = this.password.length >= 8;
    this.hasUppercase = /[A-Z]/.test(this.password);
    this.hasNumber = /\d/.test(this.password);
    this.hasSpecial = /[@$!%*?&]/.test(this.password);
  }

  isValidPassword(): boolean {
    return (
      this.hasMinLength &&
      this.hasUppercase &&
      this.hasNumber &&
      this.hasSpecial
    );
  }

  submit() {
    if (this.loading) return;

    this.error = '';

    if (!this.password || !this.confirmPassword) {
      this.error = 'Vui lòng nhập đầy đủ';
      return;
    }

    if (!this.isValidPassword()) {
      this.error = 'Mật khẩu chưa đủ mạnh';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Mật khẩu không khớp';
      return;
    }

    this.loading = true;

    this.http.post(
      `${environment.apiUrl}/auth/set-password`,
      {
        userId: this.user.userId,
        password: this.password
      }
    ).subscribe({
      next: () => {
        this.loading = false;

        if (!this.user.role) {
          this.router.navigate(['/select-role']);
        } else {
          this.router.navigate(['/dashboard']);
        }
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Lỗi server';
      }
    });
  }
}