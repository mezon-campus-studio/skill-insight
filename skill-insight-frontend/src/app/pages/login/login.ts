import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize, switchMap } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'] 
})
export class LoginComponent implements OnInit {
  
  loginForm = new FormGroup({
    email: new FormControl('', [
      Validators.required, 
      Validators.email
    ]),
    password: new FormControl('', [
      Validators.required, 
      Validators.minLength(8)
    ])
  });

  loading = false;
  error = '';
  showPassword = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  // ngOnInit(): void {
  //   // Tự động kiểm tra nếu đã đăng nhập thì vào Dashboard luôn
  //   this.auth.getMe().subscribe({
  //     next: (res: any) => {
  //       if (res?.success && res?.user) {
  //         this.auth.saveUser(res.user);
  //         this.navigateToNextStep(res.user);
  //       }
  //     },
  //     error: () => console.log("Hệ thống sẵn sàng cho đăng nhập mới.")
  //   });
  // }

ngOnInit(): void {
  const token = localStorage.getItem('accessToken');

  if (!token) {
    console.log('Hệ thống sẵn sàng cho đăng nhập mới.');
    return;
  }

  this.auth.getMe().subscribe({
    next: (res: any) => {
      if (res?.success && res?.user) {
        this.auth.saveUser(res.user);
        this.navigateToNextStep(res.user);
      }
    },
    error: () => {
      localStorage.removeItem('accessToken');
      console.log('Token không hợp lệ.');
    }
  });
}

  // Đăng nhập truyền thống bằng Email/Password
  onLogin(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    const credentials = {
      email: this.loginForm.value.email?.trim().toLowerCase() || '',
      password: this.loginForm.value.password || ''
    };

    this.auth.login(credentials)
      .pipe(
        switchMap(() => this.auth.getMe()),
        finalize(() => this.loading = false)
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
        }
      });
  }

  // Đăng nhập bằng Mezon (FLOW CHUẨN MENTOR: FE -> BE -> Mezon)
  loginWithMezon(): void {
    this.loading = true;
    this.error = '';

    this.auth.getMezonUrl().subscribe({
      next: (res: any) => {
        if (res?.success && res?.url) {
          // Khi Backend trả về URL kèm state và client_id, FE thực hiện nhảy trang
          console.log('Redirecting to Mezon:', res.url);
          window.location.href = res.url;
        } else {
          this.error = 'Không lấy được đường dẫn xác thực từ Server';
          this.loading = false;
        }
      },
      error: (err) => {
        console.error('Lỗi lấy URL Mezon:', err);
        this.error = 'Lỗi kết nối Server khi lấy URL Mezon';
        this.loading = false;
      }
    });
  }

  private navigateToNextStep(user: any): void {
    // Logic điều hướng sau khi login thành công
    if (!user.role) {
      this.router.navigate(['/select-role']);
    } else {
      this.router.navigate(['/dashboard']);
    }
  }

  goRegister(): void {
    this.router.navigate(['/register']);
  }

  goForgot(): void {
    alert('Chức năng quên mật khẩu hiện đang được phát triển');
  }

  get f() { return this.loginForm.controls; }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }
}
