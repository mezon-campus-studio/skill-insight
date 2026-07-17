import { Component, OnInit, signal } from '@angular/core'; // Thêm signal vào đây
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@Component({
  selector: 'app-set-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './set-password.html',
  styleUrls: ['./set-password.css']
})
export class SetPasswordComponent implements OnInit {

  password = '';
  confirmPassword = '';
  error = '';
  loading = false;

  // Signal quản lý Popup thành công
  showSuccessPopup = signal<boolean>(false);

  showPassword = false;
  showConfirmPassword = false;

  user: any;

  // Trạng thái các quy tắc mật khẩu
  hasMinLength = false;
  hasUppercase = false;
  hasNumber = false;
  hasSpecial = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    const userStr = localStorage.getItem('user');
    this.user = userStr ? JSON.parse(userStr) : null;

    if (!this.user || !this.user.user_id) {
      console.warn('Không tìm thấy thông tin phiên làm việc, quay về login');
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
      this.error = 'Vui lòng nhập đầy đủ mật khẩu';
      return;
    }

    if (!this.isValidPassword()) {
      this.error = 'Mật khẩu chưa đủ mạnh (phải có chữ hoa, số và ký tự đặc biệt)';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.error = 'Mật khẩu xác nhận không khớp';
      return;
    }

    this.loading = true;

    this.http.post(
      `${environment.apiUrl}/auth/set-password`,
      {
        userId: this.user.user_id, 
        password: this.password
      }
    ).subscribe({
      next: (res: any) => {
        this.loading = false;

        // Cập nhật trạng thái local
        this.user.hasPassword = true;
        localStorage.setItem('user', JSON.stringify(this.user));

        // 🔥 HIỆN POPUP THÀNH CÔNG (Thay vì dùng alert)
        this.showSuccessPopup.set(true); 
      },
      error: (err) => {
        this.loading = false;
        this.error = err?.error?.message || 'Lỗi server khi lưu mật khẩu';
      }
    });
  }

  // Hàm xử lý khi nhấn nút OK trên Popup
  closeAndNavigate() {
    this.showSuccessPopup.set(false);
    if (!this.user.role) {
      this.router.navigate(['/select-role']);
    } else {
      this.router.navigate(['/dashboard/overview']);
    }
  }
}
