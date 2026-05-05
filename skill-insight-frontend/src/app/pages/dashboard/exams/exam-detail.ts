import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@Component({
  selector: 'app-exam-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6 max-w-5xl mx-auto" *ngIf="exam">
      <!-- HEADER: Thông tin chung -->
      <div class="bg-white p-8 rounded-[35px] shadow-2xl border border-gray-100 mb-8 relative overflow-hidden">
        <div class="relative z-10">
          <div class="flex justify-between items-start">
            <div>
              <span class="text-[10px] font-black bg-blue-100 text-blue-600 px-3 py-1 rounded-full uppercase tracking-widest">Chi tiết đề thi</span>
              <h2 class="text-3xl font-black text-[#1a2b4b] uppercase italic mt-3">{{exam.title}}</h2>
              <p class="text-gray-500 font-bold mt-2 italic">Mã đề: #{{exam.exam_id}}</p>
            </div>
            <div class="text-right">
              <div class="text-2xl font-black text-blue-600">{{exam.duration}} PHÚT</div>
              <p class="text-xs font-bold text-gray-400 uppercase">Thời gian làm bài</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div class="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <p class="text-[10px] font-black text-blue-500 uppercase">Số câu hỏi</p>
              <p class="text-xl font-black text-blue-700">{{exam.questions?.length || 0}} Câu</p>
            </div>
            <div class="bg-indigo-50 p-4 rounded-2xl border border-indigo-100">
              <p class="text-[10px] font-black text-indigo-500 uppercase">Điểm tối đa</p>
              <p class="text-xl font-black text-indigo-700">10.0</p>
            </div>
            <div class="bg-green-50 p-4 rounded-2xl border border-green-100">
              <p class="text-[10px] font-black text-green-500 uppercase">Trạng thái</p>
              <p class="text-xl font-black text-green-700">Sẵn sàng</p>
            </div>
          </div>
        </div>
      </div>

      <!-- DANH SÁCH CÂU HỎI -->
      <div class="space-y-6">
        <h3 class="text-xl font-black text-gray-800 uppercase ml-4 italic flex items-center gap-2">
          <span class="w-2 h-6 bg-blue-600 rounded-full"></span>
          Nội dung câu hỏi
        </h3>

        <div *ngFor="let q of exam.questions; let i = index" 
             class="bg-white p-6 rounded-[30px] shadow-lg border border-gray-50 hover:border-blue-200 transition-all">
          <div class="flex gap-4">
            <div class="flex-shrink-0 w-10 h-10 bg-[#1a2b4b] text-white rounded-xl flex items-center justify-center font-black">
              {{i + 1}}
            </div>
            <div class="flex-grow">
              <p class="text-lg font-bold text-gray-800 mb-4 leading-relaxed">{{q.content}}</p>
              
              <!-- Danh sách đáp án -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div *ngFor="let opt of q.options; let idx = index" 
                     class="p-4 rounded-2xl border-2 transition-all flex items-center gap-3"
                     [ngClass]="opt.is_correct ? 'bg-green-50 border-green-200 text-green-700' : 'bg-gray-50 border-transparent text-gray-600'">
                  <span class="w-6 h-6 rounded-full border-2 border-current flex items-center justify-center text-[10px] font-black">
                    {{ ['A', 'B', 'C', 'D'][idx] }}
                  </span>
                  <span class="font-bold">{{opt.text}}</span>
                  <span *ngIf="opt.is_correct" class="ml-auto text-[10px] font-black uppercase">Đáp án đúng</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- FOOTER ACTIONS -->
      <div class="mt-10 flex gap-4">
        <button [routerLink]="['/dashboard/exams']" class="px-8 py-4 bg-gray-100 text-gray-600 rounded-2xl font-black uppercase tracking-widest hover:bg-gray-200 transition-all">
          Quay lại
        </button>
        <button class="flex-grow py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all active:scale-95">
          Chỉnh sửa đề thi
        </button>
      </div>
    </div>
  `
})
export class ExamDetailComponent implements OnInit {
  exam: any;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const examId = this.route.snapshot.params['id'];
    this.loadExamDetail(examId);
  }

  loadExamDetail(id: string) {
    
    this.http.get(`${environment.apiUrl}/exams/${id}`, { withCredentials: true })
      .subscribe({
        next: (res: any) => {
          this.exam = res.data;
        },
        error: (err) => {
          console.error('Lỗi lấy chi tiết đề thi:', err);
        }
      });
  }
}
