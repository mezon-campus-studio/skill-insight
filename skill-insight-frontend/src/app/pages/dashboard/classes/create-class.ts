import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '@env/environment';

@Component({
  selector: 'app-create-class',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-lg mx-auto mt-10 bg-white p-8 rounded-3xl shadow-xl">
      <h2 class="text-2xl font-black mb-6 text-gray-800 uppercase italic">Tạo lớp học mới</h2>
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-bold text-gray-600 mb-1">Tên lớp học</label>
          <input [(ngModel)]="className" class="w-full px-4 py-3 bg-blue-50 border-none rounded-xl outline-none" placeholder="VD: Lập trình Angular cơ bản">
        </div>
        <div>
          <label class="block text-sm font-bold text-gray-600 mb-1">Mô tả (tùy chọn)</label>
          <textarea [(ngModel)]="description" class="w-full px-4 py-3 bg-blue-50 border-none rounded-xl outline-none" rows="3"></textarea>
        </div>
        <button (click)="submit()" [disabled]="!className" class="w-full bg-blue-600 text-white py-3 rounded-xl font-bold hover:bg-blue-700 disabled:bg-gray-300 transition">
          XÁC NHẬN TẠO LỚP
        </button>
      </div>
    </div>
  `
})
export class CreateClassComponent {
  className = '';
  description = '';
  constructor(private http: HttpClient, private router: Router) {}
  submit() {
    this.http.post(`${environment.apiUrl}/classes`, { class_name: this.className, description: this.description }, { withCredentials: true })
      .subscribe(() => {
        alert('Tạo lớp thành công!');
        this.router.navigate(['/dashboard/classes']);
      });
  }
}
