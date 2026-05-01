import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment'; 

@Component({
  selector: 'app-course',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-3xl font-black text-[#1a2b4b] uppercase italic tracking-tighter">Khóa học của tôi</h2>
        <button class="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">
          + THÊM KHÓA HỌC
        </button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div *ngFor="let course of courses" class="bg-white rounded-[35px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-gray-100 hover:-translate-y-2 transition-all duration-300 group">
          <div class="h-48 bg-blue-100 relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-indigo-600/20"></div>
            <img [src]="course.thumbnail || 'https://placeholder.com'" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500">
          </div>
          <div class="p-6">
            <span class="text-[10px] font-black bg-blue-50 text-blue-600 px-3 py-1 rounded-full uppercase">{{course.category}}</span>
            <h3 class="text-xl font-bold text-gray-800 mt-3 mb-2">{{course.title}}</h3>
            <p class="text-gray-500 text-sm line-clamp-2 mb-4">{{course.description}}</p>
            <div class="flex justify-between items-center pt-4 border-t border-gray-50">
              <span class="font-black text-blue-600">{{course.lessonCount}} bài học</span>
              <button class="text-gray-400 hover:text-blue-600 font-bold text-sm">CHI TIẾT →</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
})
export class CourseComponent implements OnInit {
  courses: any[] = [
    { title: 'Toán học nâng cao 12', category: 'TOÁN', lessonCount: 24, description: 'Hệ thống kiến thức trọng tâm giải tích và hình học không gian.' },
    { title: 'Luyện thi IELTS 7.5+', category: 'NGOẠI NGỮ', lessonCount: 45, description: 'Tập trung kỹ năng Speaking và Writing nâng cao.' },
    { title: 'Lập trình Angular cơ bản', category: 'IT', lessonCount: 18, description: 'Xây dựng ứng dụng Web thực tế với Angular Standalone.' }
  ];

  constructor(private http: HttpClient) {}
  ngOnInit(): void {}
}

