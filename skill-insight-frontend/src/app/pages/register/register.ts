import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    RouterModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  full_name = '';
  email = '';
  password = '';
  confirmPassword = '';

  showPassword = false;
  showConfirmPassword = false;

  acceptTerms = false;

  error = '';
  loading = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  validatePassword(password: string): boolean {
    const regex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

    return regex.test(password);
  }

  onRegister(): void {
    this.error = '';

    if (
      !this.full_name.trim() ||
      !this.email.trim() ||
      !this.password.trim() ||
      !this.confirmPassword.trim()
    ) {
      this.error = 'Vui lòng nhập đầy đủ thông tin';
      return;
    }

    if (!this.validatePassword(this.password)) {
      this.error =
        'Mật khẩu phải tối thiểu 8 ký tự, có 1 chữ hoa, 1 số và 1 ký tự đặc biệt';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Mật khẩu nhập lại không khớp';
      return;
    }

    if (!this.acceptTerms) {
      this.error =
        'Vui lòng đồng ý với Điều khoản sử dụng và Chính sách bảo mật';
      return;
    }

    this.loading = true;

    this.http.post(
      `${environment.apiUrl}/auth/register`,
      {
        full_name: this.full_name,
        email: this.email,
        password: this.password
      }
    ).subscribe({
      next: () => {
        alert('Đăng ký thành công');
        this.router.navigate(['/login']);
      },

      error: (err) => {
        this.error =
          err.error?.message || 'Đăng ký thất bại';
        this.loading = false;
      },

      complete: () => {
        this.loading = false;
      }
    });
  }

  goLogin(): void {
    this.router.navigate(['/login']);
  }
}