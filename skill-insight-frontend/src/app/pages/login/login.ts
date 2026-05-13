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

  ngOnInit(): void {}

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
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res: any) => {
          if (res?.user) {
            this.auth.saveUser(res.user);
            const role = res.user?.role;
            if (!role || role.trim() === '') {
              this.router.navigate(['/select-role']);
            } else if (role === 'teacher' || role === 'admin') {
              this.router.navigate(['/subject']);
            } else {
              this.router.navigate(['/home']);
            }
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

  get f() {
    return this.loginForm.controls;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
