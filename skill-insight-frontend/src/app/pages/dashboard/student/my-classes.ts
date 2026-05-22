import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@Component({
  selector: 'app-my-classes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6 max-w-6xl mx-auto">
      
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
        <div>
          <h2 class="text-3xl font-black text-[#1a2b4b] uppercase italic tracking-tighter">Lớp học của tôi</h2>
          <p class="text-gray-400 font-medium mt-1">Danh sách các lớp bạn đang theo học</p>
        </div>
        <button routerLink="/dashboard/join-class" 
                class="bg-blue-600 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all active:scale-95">
          + THAM GIA LỚP MỚI
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" *ngIf="myClasses.length > 0; else emptyState">
        <div *ngFor="let item of myClasses" 
             class="bg-white rounded-[35px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 hover:-translate-y-2 transition-all duration-300 group">
          
          <div class="h-32 bg-gradient-to-br from-blue-500 to-indigo-600 p-6 flex justify-end items-start">
             <span class="bg-white/20 backdrop-blur-md text-white text-[10px] font-black px-3 py-1 rounded-full uppercase">
               {{item.subject || 'Học phần'}}
             </span>
          </div>

          <div class="p-8 -mt-12">
      
            <div class="w-20 h-20 bg-white rounded-3xl shadow-xl flex items-center justify-center text-3xl mb-4 border border-gray-50">
               {{item.class_name.charAt(0)}}
            </div>

            <h3 class="text-xl font-black text-gray-800 mb-1 group-hover:text-blue-600 transition-colors uppercase italic">
              {{item.class_name}}
            </h3>
            <p class="text-gray-400 font-bold text-sm mb-6">Mã lớp: {{item.class_code}}</p>

            <div class="flex items-center gap-3 py-4 border-t border-gray-50">
              <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-black">
                {{item.teacher?.full_name?.charAt(0) || 'G'}}
              </div>
              <div class="flex flex-col">
                <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-none">Giáo viên</span>
                <span class="text-sm font-bold text-gray-700">{{item.teacher?.full_name || 'Đang cập nhật'}}</span>
              </div>
            </div>

            <button [routerLink]="['/dashboard/classes', item.class_id]" 
                    class="w-full mt-2 py-4 bg-blue-50 text-blue-600 rounded-2xl font-black uppercase tracking-widest group-hover:bg-blue-600 group-hover:text-white transition-all">
              VÀO LỚP HỌC
            </button>
          </div>
        </div>
      </div>

      <ng-template #emptyState>
        <div class="bg-white rounded-[45px] p-20 text-center shadow-xl border border-gray-50">
          <div class="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
            </svg>
          </div>
          <h3 class="text-2xl font-black text-gray-800 uppercase italic">Bạn chưa tham gia lớp nào</h3>
          <p class="text-gray-400 font-medium mt-2 mb-8">Hãy sử dụng mã code từ giáo viên để tham gia lớp học ngay.</p>
          <button routerLink="/dashboard/join-class" class="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg">
            THAM GIA NGAY
          </button>
        </div>
      </ng-template>

    </div>
  `
})
export class MyClassesComponent implements OnInit {
  myClasses: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMyClasses();
  }

  loadMyClasses() {
    // API giả định
    this.http.get<any>(`${environment.apiUrl}/student/my-classes`, { withCredentials: true })
      .subscribe({
        next: (res) => {
          this.myClasses = res.data || [];
        },
        error: (err) => {
          console.error('Lỗi lấy danh sách lớp học:', err);
        }
      });
  }
}
