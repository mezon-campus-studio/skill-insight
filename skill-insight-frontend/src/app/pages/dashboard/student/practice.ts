import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-practice',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="min-h-screen bg-slate-50 p-4 md:p-8">
      <div class="max-w-6xl mx-auto space-y-8">

        <!-- HEADER -->
        <div class="bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 rounded-[40px] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">

          <div class="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

          <div class="relative z-10">
            <p class="uppercase tracking-[4px] text-[11px] font-black opacity-70 mb-3">
              Hệ thống luyện tập thông minh
            </p>

            <h1 class="text-4xl md:text-5xl font-black italic leading-none mb-4">
              TỰ LUYỆN TẬP
            </h1>

            <p class="max-w-2xl text-sm md:text-base text-blue-100 leading-relaxed">
              Tạo đề luyện ngẫu nhiên theo môn học, độ khó và số lượng câu hỏi.
              Hệ thống sẽ tự động chọn câu hỏi từ ngân hàng đề thi.
            </p>

            <div class="flex flex-wrap gap-3 mt-8">
              <div class="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur text-xs font-bold uppercase tracking-widest">
                AI RANDOM
              </div>

              <div class="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur text-xs font-bold uppercase tracking-widest">
                REAL EXAM
              </div>

              <div class="px-4 py-2 rounded-2xl bg-white/10 backdrop-blur text-xs font-bold uppercase tracking-widest">
                SMART TRAINING
              </div>
            </div>
          </div>
        </div>

        <!-- CONTENT -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

          <!-- LEFT CONFIG -->
          <div class="lg:col-span-1">
            <div class="bg-white rounded-[32px] p-7 shadow-xl border border-slate-100">

              <div class="mb-8">
                <p class="text-[11px] font-black uppercase tracking-[3px] text-blue-500 mb-2">
                  Thiết lập đề luyện
                </p>

                <h3 class="text-2xl font-black text-slate-800 italic">
                  Cấu hình nhanh
                </h3>
              </div>

              <div class="space-y-5">

                <!-- SUBJECT -->
                <div>
                  <label class="block text-[11px] uppercase tracking-widest font-black text-slate-400 mb-2">
                    Chọn môn học
                  </label>

                  <select
                    [(ngModel)]="subject"
                    class="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border border-slate-100 focus:ring-4 focus:ring-blue-500/10">

                    <option value="math">Toán</option>
                    <option value="physics">Vật lý</option>
                    <option value="chemistry">Hóa học</option>
                    <option value="english">Tiếng Anh</option>
                    <option value="biology">Sinh học</option>
                  </select>
                </div>

                <!-- LEVEL -->
                <div>
                  <label class="block text-[11px] uppercase tracking-widest font-black text-slate-400 mb-2">
                    Mức độ khó
                  </label>

                  <select
                    [(ngModel)]="level"
                    class="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border border-slate-100 focus:ring-4 focus:ring-indigo-500/10">

                    <option value="easy">Dễ</option>
                    <option value="medium">Trung bình</option>
                    <option value="hard">Khó</option>
                  </select>
                </div>

                <!-- COUNT -->
                <div>
                  <label class="block text-[11px] uppercase tracking-widest font-black text-slate-400 mb-2">
                    Số lượng câu hỏi
                  </label>

                  <input
                    type="number"
                    [(ngModel)]="questionCount"
                    min="1"
                    placeholder="VD: 20"
                    class="w-full p-4 bg-slate-50 rounded-2xl font-bold outline-none border border-slate-100 focus:ring-4 focus:ring-purple-500/10">
                </div>

                <!-- BUTTON -->
                <button
                  (click)="startPractice()"
                  class="w-full py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black uppercase italic tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-blue-200">

                  Bắt đầu luyện tập
                </button>

              </div>
            </div>
          </div>

          <!-- RIGHT PREVIEW -->
          <div class="lg:col-span-2">
            <div class="bg-white rounded-[32px] p-8 shadow-xl border border-slate-100 h-full">

              <div class="flex items-center justify-between mb-8">
                <div>
                  <p class="text-[11px] uppercase tracking-[3px] font-black text-indigo-500 mb-2">
                    Xem trước đề luyện
                  </p>

                  <h3 class="text-2xl font-black text-slate-800 italic">
                    Thông tin hiện tại
                  </h3>
                </div>

                <div class="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-2xl">
                  📘
                </div>
              </div>

              <!-- PREVIEW CARD -->
              <div class="grid md:grid-cols-3 gap-5 mb-8">

                <div class="p-6 rounded-3xl bg-blue-50 border border-blue-100">
                  <p class="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-2">
                    Môn học
                  </p>

                  <h4 class="text-xl font-black text-blue-700">
                    {{ subject }}
                  </h4>
                </div>

                <div class="p-6 rounded-3xl bg-indigo-50 border border-indigo-100">
                  <p class="text-[10px] font-black uppercase tracking-widest text-indigo-400 mb-2">
                    Độ khó
                  </p>

                  <h4 class="text-xl font-black text-indigo-700">
                    {{ level }}
                  </h4>
                </div>

                <div class="p-6 rounded-3xl bg-purple-50 border border-purple-100">
                  <p class="text-[10px] font-black uppercase tracking-widest text-purple-400 mb-2">
                    Số câu
                  </p>

                  <h4 class="text-xl font-black text-purple-700">
                    {{ questionCount }}
                  </h4>
                </div>

              </div>

              <!-- DESCRIPTION -->
              <div class="rounded-3xl bg-slate-50 p-6 border border-slate-100">
                <p class="text-sm text-slate-500 leading-relaxed">
                  Sau khi bắt đầu, hệ thống sẽ sinh đề luyện tập phù hợp với cấu hình đã chọn.
                  Các câu hỏi được lấy ngẫu nhiên từ ngân hàng đề để đảm bảo trải nghiệm luyện tập đa dạng.
                </p>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  `
})
export class PracticeComponent {

  subject = 'math';
  level = 'medium';
  questionCount = 20;

  constructor(private router: Router) {}

  startPractice() {

    localStorage.setItem(
      'practice-config',
      JSON.stringify({
        subject: this.subject,
        level: this.level,
        questionCount: this.questionCount
      })
    );

    // chuyển sang trang làm bài
    this.router.navigate(['/dashboard/exam', 1]);
  }
}