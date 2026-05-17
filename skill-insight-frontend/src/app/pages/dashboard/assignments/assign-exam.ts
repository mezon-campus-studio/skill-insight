import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-assign-exam',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-4xl mx-auto">
      <div class="bg-white p-10 rounded-[40px] shadow-2xl border-t-8 border-indigo-600">
        <h2 class="text-2xl font-black text-gray-800 uppercase mb-8">Giao bài tập/đề thi</h2>
        
        <div class="space-y-6">
          <div class="group">
            <label class="font-black text-xs text-indigo-500 uppercase ml-2">1. Chọn lớp học</label>
            <select class="w-full p-4 bg-indigo-50 rounded-2xl border-none outline-none font-bold mt-1">
              <option>Lớp 12A1</option>
              <option>Lớp 11B2</option>
            </select>
          </div>

          <div class="group">
            <label class="font-black text-xs text-indigo-500 uppercase ml-2">2. Chọn đề thi từ kho</label>
            <select class="w-full p-4 bg-indigo-50 rounded-2xl border-none outline-none font-bold mt-1">
              <option>Đề kiểm tra giữa kỳ Toán</option>
              <option>Đề luyện tập Reading</option>
            </select>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="font-black text-xs text-indigo-500 uppercase ml-2">Ngày bắt đầu</label>
              <input type="datetime-local" class="w-full p-4 bg-gray-50 rounded-2xl outline-none mt-1">
            </div>
            <div>
              <label class="font-black text-xs text-indigo-500 uppercase ml-2">Ngày kết thúc</label>
              <input type="datetime-local" class="w-full p-4 bg-gray-50 rounded-2xl outline-none mt-1">
            </div>
          </div>

          <button class="w-full bg-indigo-600 text-white py-5 rounded-[20px] font-black uppercase tracking-widest shadow-2xl">XÁC NHẬN GIAO BÀI</button>
        </div>
      </div>
    </div>
  `
})
export class AssignExamComponent {}
