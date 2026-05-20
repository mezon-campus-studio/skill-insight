import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../services/auth.service'; 


@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-2xl mx-auto p-6">
      <div class="bg-white rounded-[32px] p-8 shadow-2xl shadow-blue-100 border border-gray-100">
        <div class="flex flex-col items-center mb-8">
          <div class="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-3xl font-black mb-4">
            {{user?.full_name?.charAt(0)}}
          </div>
          <h2 class="text-2xl font-black text-gray-800 uppercase italic">Thông tin cá nhân</h2>
        </div>
        
        <div class="space-y-4">
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-blue-500 uppercase ml-2">Họ và tên</label>
            <input [(ngModel)]="user.full_name" class="w-full px-5 py-3.5 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-blue-400">
          </div>
          <div class="flex flex-col gap-1">
            <label class="text-xs font-bold text-blue-500 uppercase ml-2">Email (Không thể sửa)</label>
            <input [value]="user.email" disabled class="w-full px-5 py-3.5 bg-gray-100 text-gray-500 rounded-2xl outline-none border-none cursor-not-allowed">
          </div>
          <div class="pt-6">
            <button (click)="update()" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition active:scale-95 shadow-lg shadow-blue-100">
              CẬP NHẬT THÔNG TIN
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ProfileComponent implements OnInit {
  user: any = {};
  constructor(private auth: AuthService) {}
  ngOnInit() { this.user = { ...this.auth.getUser() }; }
  update() {
    this.auth.updateProfile(this.user).subscribe(() => alert('Đã cập nhật!'));
  }
}
