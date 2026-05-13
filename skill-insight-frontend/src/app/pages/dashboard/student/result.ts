import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-result',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div class="max-w-2xl w-full bg-white rounded-[45px] shadow-[0_30px_80px_rgba(0,0,0,0.1)] p-10 text-center border border-white">
        
        <h2 class="text-2xl font-black text-gray-400 uppercase tracking-widest mb-2">Kết quả bài thi</h2>
        <h1 class="text-4xl font-black text-[#1a2b4b] mb-10">KIỂM TRA GIỮA KỲ I</h1>

        <!-- Điểm số nổi bật -->
        <div class="relative w-48 h-48 mx-auto mb-10">
          <div class="absolute inset-0 rounded-full border-[12px] border-gray-100"></div>
          <div class="absolute inset-0 rounded-full border-[12px] border-green-500 border-t-transparent -rotate-45"></div>
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-6xl font-black text-green-500">9.5</span>
            <span class="text-xs font-bold text-gray-400 uppercase">Điểm số</span>
          </div>
        </div>

        <!-- Thống kê chi tiết -->
        <div class="grid grid-cols-3 gap-4 mb-10">
          <div class="p-4 bg-blue-50 rounded-3xl">
            <p class="text-[10px] font-black text-blue-500 uppercase">Đúng</p>
            <p class="text-xl font-black text-blue-700">38/40</p>
          </div>
          <div class="p-4 bg-red-50 rounded-3xl">
            <p class="text-[10px] font-black text-red-500 uppercase">Sai</p>
            <p class="text-xl font-black text-red-700">2</p>
          </div>
          <div class="p-4 bg-orange-50 rounded-3xl">
            <p class="text-[10px] font-black text-orange-500 uppercase">Thời gian</p>
            <p class="text-xl font-black text-orange-700">15:20</p>
          </div>
        </div>

        <div class="flex gap-4">
          <button routerLink="/dashboard/practice" class="flex-1 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all">LÀM LẠI</button>
          <button routerLink="/dashboard/overview" class="flex-1 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">VỀ BẢNG TIN</button>
        </div>
      </div>
    </div>
  `
})
export class ResultComponent implements OnInit {
  constructor(private route: ActivatedRoute) {}
  ngOnInit(): void {}
}
