import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-exam',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 p-6">
      <div class="max-w-4xl mx-auto bg-white p-10 rounded-[40px] shadow-2xl relative">
        <div class="flex justify-between items-center mb-10 border-b pb-6">
          <h2 class="text-2xl font-black text-gray-800">ĐANG LÀM BÀI: TOÁN 12</h2>
          <div class="px-6 py-3 bg-red-500 text-white rounded-2xl font-black text-xl tracking-tighter">
            29:59
          </div>
        </div>

        <div class="space-y-8">
          <div *ngFor="let q of [1,2,3]; let i = index" class="p-6 bg-blue-50/50 rounded-[30px] border border-blue-100">
            <p class="font-bold text-lg mb-4 text-gray-700">Câu {{i+1}}: Nội dung câu hỏi trắc nghiệm?</p>
            <div class="grid grid-cols-1 gap-3">
              <label *ngFor="let opt of ['A','B','C','D']" class="flex items-center gap-4 p-4 bg-white rounded-2xl cursor-pointer hover:border-blue-400 border-2 border-transparent transition-all">
                <input type="radio" [name]="'q'+i" class="w-5 h-5 accent-blue-600">
                <span class="font-bold text-gray-600">Đáp án {{opt}}</span>
              </label>
            </div>
          </div>
        </div>

        <button class="mt-10 w-full bg-blue-600 text-white py-5 rounded-[25px] font-black text-xl shadow-2xl shadow-blue-200 uppercase tracking-widest active:scale-95 transition-all">
          NỘP BÀI THI NGAY
        </button>
      </div>
    </div>
  `
})
export class StudentExamComponent {}
