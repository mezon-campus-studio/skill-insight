import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-question',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-3xl mx-auto p-6">
      <div class="bg-white p-10 rounded-[40px] shadow-2xl">
        <h2 class="text-2xl font-black text-gray-800 uppercase italic mb-8">Thêm câu hỏi mới vào kho</h2>
        
        <div class="space-y-5">
          <textarea [(ngModel)]="content" placeholder="Nội dung câu hỏi" class="w-full p-5 bg-blue-50 rounded-3xl outline-none min-h-[150px] font-medium"></textarea>
          
          <div class="grid grid-cols-2 gap-4">
            <input placeholder="Đáp án đúng" class="p-4 bg-green-50 rounded-xl outline-none border-2 border-green-200 font-bold">
            <input placeholder="Đáp án nhiễu 1" class="p-4 bg-red-50 rounded-xl outline-none font-medium">
          </div>

          <div class="flex gap-4">
            <select class="flex-1 p-4 bg-gray-50 rounded-xl font-bold">
              <option>Chọn môn học</option>
              <option>Toán</option>
            </select>
            <select class="flex-1 p-4 bg-gray-50 rounded-xl font-bold">
              <option>Chọn mức độ</option>
              <option>Khó</option>
            </select>
          </div>

          <button class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase shadow-xl">LƯU VÀO NGÂN HÀNG</button>
        </div>
      </div>
    </div>
  `
})
export class CreateQuestionComponent {
  content = '';
}
