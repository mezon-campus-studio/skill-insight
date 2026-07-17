import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-md mx-auto mt-10">
      <div class="bg-white p-10 rounded-[40px] shadow-2xl border border-gray-100">
        <h2 class="text-2xl font-black text-gray-800 uppercase italic mb-8 text-center">Đổi mật khẩu</h2>
        <div class="space-y-5">
          <input type="password" placeholder="Mật khẩu hiện tại" class="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none">
          <input type="password" placeholder="Mật khẩu mới" class="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none border-2 border-transparent focus:border-blue-500">
          <input type="password" placeholder="Nhập lại mật khẩu mới" class="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none">
          <button class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase shadow-lg hover:bg-blue-700 transition">CẬP NHẬT MẬT KHẨU</button>
        </div>
      </div>
    </div>
  `
})
export class ChangePasswordComponent {}
