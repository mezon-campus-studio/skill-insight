import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-questions',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <div class="bg-white p-8 rounded-[35px] shadow-2xl mb-8">
        <h2 class="text-2xl font-black text-gray-800 uppercase italic mb-6">Ngân hàng câu hỏi</h2>
        
        <!-- BỘ LỌC -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <select [(ngModel)]="filter.subject" class="px-4 py-3 bg-blue-50 rounded-xl outline-none font-bold text-blue-600">
            <option value="">Tất cả môn học</option>
            <option value="math">Toán học</option>
            <option value="english">Tiếng Anh</option>
          </select>
          <select [(ngModel)]="filter.level" class="px-4 py-3 bg-blue-50 rounded-xl outline-none font-bold text-blue-600">
            <option value="">Mức độ</option>
            <option value="easy">Dễ</option>
            <option value="medium">Trung bình</option>
            <option value="hard">Khó</option>
          </select>
          <button (click)="loadQuestions()" class="bg-blue-600 text-white rounded-xl font-black uppercase tracking-widest">Lọc câu hỏi</button>
          <button class="bg-green-600 text-white rounded-xl font-black uppercase tracking-widest">Upload Excel</button>
        </div>

        <div class="space-y-4">
          <div *ngFor="let q of filteredQuestions" class="p-5 bg-gray-50 rounded-2xl border-l-8 border-blue-500">
            <p class="font-bold text-gray-700">{{q.content}}</p>
            <div class="mt-2 flex gap-3">
              <span class="text-[10px] bg-blue-100 text-blue-600 px-2 py-1 rounded-md font-black uppercase">{{q.subject}}</span>
              <span class="text-[10px] bg-orange-100 text-orange-600 px-2 py-1 rounded-md font-black uppercase">{{q.level}}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class QuestionsComponent {
  filter = { subject: '', level: '' };
  filteredQuestions = [
    { content: '1 + 1 bằng mấy?', subject: 'Toán', level: 'Dễ' },
    { content: 'Cấu trúc thì hiện tại đơn?', subject: 'Anh văn', level: 'Khó' }
  ];
  loadQuestions() { /* Logic gọi API lọc từ kho dữ liệu */ }
}
