import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-create-exam',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6 max-w-4xl mx-auto">
      <div class="bg-white p-10 rounded-[40px] shadow-2xl">
        <h2 class="text-3xl font-black text-gray-800 uppercase mb-8 italic">Thiết lập đề thi mới</h2>
        <div class="space-y-6">
          <div class="flex flex-col gap-2">
            <label class="font-bold text-blue-500 uppercase ml-1">Tiêu đề đề thi</label>
            <input [(ngModel)]="title" class="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none" placeholder="VD: Kiểm tra cuối kỳ I">
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="flex flex-col gap-2">
              <label class="font-bold text-blue-500 uppercase ml-1">Thời gian (phút)</label>
              <input type="number" [(ngModel)]="duration" class="w-full px-5 py-4 bg-gray-50 rounded-2xl outline-none">
            </div>
          </div>
          <button (click)="save()" class="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black uppercase hover:shadow-xl transition shadow-indigo-100">LƯU ĐỀ THI</button>
        </div>
      </div>
    </div>
  `
})
export class CreateExamComponent {
  title = ''; duration = 60;
  constructor(private http: HttpClient) {}
  save() { /* Logic gửi API */ }
}
