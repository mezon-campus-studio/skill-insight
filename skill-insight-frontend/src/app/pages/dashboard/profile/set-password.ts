import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment'; 

@Component({
  selector: 'app-set-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4">
      <div class="w-full max-w-md bg-white p-10 rounded-[40px] shadow-2xl border border-gray-50">
        
        <div class="text-center mb-10">
          <h2 class="text-3xl font-black text-[#1a2b4b] uppercase italic tracking-tighter">Thiết lập mật khẩu</h2>
          <p class="text-gray-400 text-sm mt-2 font-medium">Vui lòng tạo mật khẩu cho lần đầu đăng nhập</p>
        </div>

        <form [formGroup]="passwordForm" (ngSubmit)="onSubmit()" class="space-y-6">
          <div class="flex flex-col gap-1.5 text-left">
            <label class="text-sm font-black text-gray-500 ml-2 uppercase">Mật khẩu mới</label>
            <input type="password" formControlName="password" placeholder="••••••••"
              class="w-full px-5 py-4 bg-[#f0f4f9] border-none rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-medium transition-all" />
          </div>

          <div class="flex flex-col gap-1.5 text-left">
            <label class="text-sm font-black text-gray-500 ml-2 uppercase">Xác nhận mật khẩu</label>
            <input type="password" formControlName="confirmPassword" placeholder="••••••••"
              class="w-full px-5 py-4 bg-[#f0f4f9] border-none rounded-2xl outline-none focus:ring-4 focus:ring-blue-100 font-medium transition-all" />
          </div>

          <button type="submit" [disabled]="passwordForm.invalid"
            class="w-full bg-blue-600 text-white py-5 rounded-[25px] font-black uppercase tracking-[2px] shadow-xl shadow-blue-100 hover:bg-blue-700 disabled:bg-gray-200 transition-all active:scale-95">
            XÁC NHẬN MẬT KHẨU
          </button>
        </form>
      </div>
    </div>
  `
})
export class SetPasswordComponent {
  passwordForm = new FormGroup({
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    confirmPassword: new FormControl('', [Validators.required])
  });

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (this.passwordForm.value.password !== this.passwordForm.value.confirmPassword) {
      alert('Mật khẩu xác nhận không khớp!');
      return;
    }
    
    // Gọi API Backend: /api/auth/set-password
    this.http.post(`${environment.apiUrl}/auth/set-password`, this.passwordForm.value, { withCredentials: true })
      .subscribe(() => {
        alert('Thiết lập mật khẩu thành công!');
        this.router.navigate(['/dashboard/overview']);
      });
  }
}