import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { finalize } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent {
  loading = false;
  error = '';
  successMessage = '';

  showPopup = false;
  popupMessage = '';
  popupType: 'success' | 'error' = 'success';

  showPassword = false;
  showConfirmPassword = false;

  registerForm = new FormGroup({
    full_name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/),
    ]),
    confirmPassword: new FormControl('', [Validators.required]),
    acceptTerms: new FormControl(false),
  });

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  get f() {
    return this.registerForm.controls;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  openPopup(message: string, type: 'success' | 'error' = 'success') {
    this.popupMessage = message;
    this.popupType = type;
    this.showPopup = true;
  }

  closePopup() {
    this.showPopup = false;
  }

  getPasswordError(): string {
    const errors = this.f.password.errors;
    if (!errors) return '';

    if (errors['required']) return 'Mật khẩu là bắt buộc';
    if (errors['minlength']) return 'Mật khẩu phải ít nhất 8 ký tự';
    if (errors['pattern']) return 'Phải có kí tự hoa, số và ký tự đặc biệt';

    return '';
  }

  getEmailError(): string {
    const errors = this.f.email.errors;
    if (!errors) return '';

    if (errors['required']) return 'Email là bắt buộc';
    if (errors['email']) return 'Email không hợp lệ';

    return '';
  }

  onRegister() {
    this.error = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.openPopup('Vui lòng nhập đúng thông tin!', 'error');
      return;
    }

    if (this.f.password.value !== this.f.confirmPassword.value) {
      this.openPopup('Mật khẩu nhập lại không khớp!', 'error');
      return;
    }

    this.loading = true;

    const { full_name, email, password } = this.registerForm.value;

    this.http
      .post(`${environment.apiUrl}/register`, {
        full_name,
        email,
        password,
      })
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: () => {
          this.openPopup('Đăng ký thành công!', 'success');

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (err) => {
          this.openPopup(err?.error?.message || 'Đăng ký thất bại', 'error');
        },
      });
  }

  goLogin() {
    this.router.navigate(['/login']);
  }
}
