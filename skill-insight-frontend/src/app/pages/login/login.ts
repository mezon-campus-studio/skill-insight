import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize, switchMap } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';
@Component({
  selector: 'app-login',
  standalone: true,
  // Sử dụng ReactiveFormsModule thay vì FormsModule để quản lý form chuyên nghiệp
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
  });

  loading = false;
  error = '';
  showPassword = false;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    // this.auth.getMe().subscribe({
    //   next: (res: any) => {
    //     if (res?.success && res?.user) {
    //       this.auth.saveUser(res.user);
    //       this.navigateToNextStep(res.user);
    //     }
    //   },
    //   error: () => console.log('Hệ thống sẵn sàng cho đăng nhập mới.'),
    // });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    const credentials = {
      email: this.loginForm.value.email?.trim().toLowerCase() || '',
      password: this.loginForm.value.password || '',
    };

    this.auth
      .login(credentials)
      .pipe(
        //switchMap(() => this.auth.getMe()),
        finalize(() => (this.loading = false)),
      )
      .subscribe({
        next: (res: any) => {
          if (res?.user) {
            this.auth.saveUser(res.user);
            this.navigateToNextStep(res.user);
          }
        },
        error: (err: any) => {
          this.error = err?.error?.message || 'Email hoặc mật khẩu không chính xác';
        },
      });
  }

  goRegister(): void {
    this.router.navigate(['/register']);
  }

  goForgot(): void {
    alert('Chức năng quên mật khẩu hiện đang được phát triển');
  }

  login() {
    this.auth.loginWithMezon();
  }
  private navigateToNextStep(user: any): void {
    // Nếu user mới chưa chọn vai trò (Student/Teacher)
    if (!user.role) {
      this.router.navigate(['/select-role']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
