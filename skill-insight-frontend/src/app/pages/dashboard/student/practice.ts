import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-practice',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-4xl mx-auto">
      <div class="bg-gradient-to-br from-blue-600 to-indigo-700 p-10 rounded-[40px] text-white shadow-2xl mb-10">
        <h2 class="text-3xl font-black uppercase italic mb-2">Tự luyện tập</h2>
        <p class="opacity-80">Hệ thống sẽ tự động lấy câu hỏi ngẫu nhiên từ kho theo yêu cầu của bạn</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="bg-white p-6 rounded-[30px] shadow-xl border-b-4 border-blue-500">
          <h4 class="font-black text-blue-600 uppercase mb-4">Cấu hình nhanh</h4>
          <div class="space-y-4">
            <select class="w-full p-3 bg-blue-50 rounded-xl font-bold outline-none border-none">
              <option>Môn Toán</option>
            </select>
            <select class="w-full p-3 bg-blue-50 rounded-xl font-bold outline-none border-none">
              <option>Mức độ Khó</option>
            </select>
            <input type="number" placeholder="Số câu (VD: 20)" class="w-full p-3 bg-blue-50 rounded-xl font-bold outline-none border-none">
            <button class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase italic">Bắt đầu ngay</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class PracticeComponent {}
