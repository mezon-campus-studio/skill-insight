<<<<<<< HEAD
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service'; 
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './overview.html',
  styleUrls: ['./overview.css']
})
export class OverviewComponent implements OnInit {
  user: any;
  currentTime = new Date();

  // --- CONFIG BIỂU ĐỒ ---
  
  // 1. Biểu đồ Admin: Tăng trưởng người dùng (Line Chart)
  public adminChartData: ChartData<'line'> = {
    labels: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6'],
    datasets: [
      {
        data: [65, 159, 280, 481, 556, 855],
        label: 'Người dùng mới',
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // 2. Biểu đồ Teacher: Phân tích điểm số (Bar Chart)
  public teacherChartData: ChartData<'bar'> = {
    labels: ['12A1', '12A2', '11B1', '10C2'],
    datasets: [
      { data: [8.5, 7.2, 6.8, 5.5], label: 'Điểm TB lớp', backgroundColor: '#10b981' }
    ]
  };

  // 3. Biểu đồ Student: Tiến độ kỹ năng (Radar/Doughnut Chart)
  public studentChartData: ChartData<'doughnut'> = {
    labels: ['Hoàn thành', 'Đang học', 'Chưa bắt đầu'],
    datasets: [
      { data: [12, 5, 3], backgroundColor: ['#3b82f6', '#f59e0b', '#e2e8f0'] }
    ]
  };

  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } }
  };

  // --- DỮ LIỆU CARD ---
    adminStats = [
      { label: 'Doanh thu', value: '145M', trend: '+12%', type: 'revenue' },
      { label: 'Học sinh', value: '1,250', trend: '+18%', type: 'students' },
      { label: 'Giáo viên', value: '45', trend: 'Ổn định', type: 'teachers' }, // Mới
      { label: 'Vùng miền', value: '63 Tỉnh', trend: 'Toàn quốc', type: 'region' },
      { label: 'Độ tuổi', value: '15 - 25', trend: 'Phổ biến', type: 'age' }
    ];



  

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.user = this.auth.getUser();
  }

  get greeting(): string {
    const hour = this.currentTime.getHours();
    if (hour < 12) return 'Chào buổi sáng';
    if (hour < 18) return 'Chào buổi chiều';
    return 'Chào buổi tối';
  }
}
=======
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service'; 

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 space-y-8">
      
      <div class="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
        <div class="relative z-10">
          <h1 class="text-3xl font-black uppercase italic">Xin chào, {{user?.full_name}}!</h1>
          <p class="opacity-90 font-medium mt-1">{{welcomeMessage}}</p>
        </div>
      
        <div class="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full"></div>
      </div>

      <div *ngIf="user?.role === 'ADMIN'" class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div *ngFor="let card of adminStats" class="bg-white p-6 rounded-[30px] shadow-xl border-b-8 border-blue-500 hover:-translate-y-2 transition-all">
          <p class="text-gray-400 font-black uppercase text-[10px] tracking-widest">{{card.label}}</p>
          <h3 class="text-4xl font-black text-slate-800 mt-2">{{card.value}}</h3>
        </div>
      </div>

      <div *ngIf="user?.role === 'TEACHER'" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div class="bg-white p-6 rounded-[30px] shadow-xl border-l-8 border-green-500">
            <p class="text-gray-400 font-bold uppercase text-xs">Lớp học tốt nhất</p>
            <h3 class="text-2xl font-black text-green-600 mt-1">12A1 (8.5đ AVG)</h3>
          </div>
          <div class="bg-white p-6 rounded-[30px] shadow-xl border-l-8 border-red-500">
            <p class="text-gray-400 font-bold uppercase text-xs">Nhóm học sinh yếu</p>
            <h3 class="text-2xl font-black text-red-600 mt-1">15 em (Dưới 5đ)</h3>
          </div>
          <div class="bg-white p-6 rounded-[30px] shadow-xl border-l-8 border-orange-500">
            <p class="text-gray-400 font-bold uppercase text-xs">Kiến thức hổng nhiều nhất</p>
            <h3 class="text-2xl font-black text-orange-600 mt-1">Hình học không gian</h3>
          </div>
        </div>
        
        <div class="bg-white p-8 rounded-[35px] shadow-lg">
          <h4 class="font-black uppercase text-slate-700 mb-4 flex items-center gap-2">
            <span class="w-3 h-3 bg-red-500 rounded-full animate-ping"></span> 
            Học sinh cần chú ý đặc biệt
          </h4>
          <div class="space-y-3">
            <div *ngFor="let student of weakStudents" class="flex justify-between items-center p-4 bg-red-50 rounded-2xl border border-red-100">
              <span class="font-bold text-slate-700">{{student.name}} - {{student.class}}</span>
              <span class="text-xs font-black text-red-500 uppercase italic">Yếu: {{student.weakPoint}}</span>
            </div>
          </div>
        </div>
      </div>

      <div *ngIf="user?.role === 'STUDENT'" class="space-y-6">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Tiến độ -->
          <div class="bg-white p-8 rounded-[35px] shadow-xl">
            <h4 class="font-black uppercase text-blue-600 mb-4 text-sm">Năng lực hiện tại</h4>
            <div class="space-y-4">
              <div *ngFor="let skill of studentSkills">
                <div class="flex justify-between text-xs font-bold uppercase mb-1">
                  <span>{{skill.subject}}</span>
                  <span>{{skill.percent}}%</span>
                </div>
                <div class="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
                  <div class="bg-blue-500 h-full rounded-full transition-all duration-1000" [style.width.%]="skill.percent"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Lời khuyên -->
          <div class="bg-indigo-50 p-8 rounded-[35px] border-2 border-dashed border-indigo-200">
            <h4 class="font-black uppercase text-indigo-700 mb-4 text-sm italic underline">Gợi ý cải thiện</h4>
            <ul class="space-y-3 font-bold text-slate-600 text-sm">
              <li class="flex items-start gap-2">Luyện thêm 20 câu "Đạo hàm" để tăng 15% điểm số.</li>
              <li class="flex items-start gap-2">Xem lại bài giảng "Thì hiện tại hoàn thành".</li>
              <li class="flex items-start gap-2">Mục tiêu tuần này: Hoàn thành 2 đề luyện tập.</li>
            </ul>
          </div>
        </div>
      </div>

    </div>
  `
})
export class OverviewComponent implements OnInit {
  user: any;
  welcomeMessage = '';

  // Dữ liệu giả lập (Sau này gọi từ API dựa trên user.userId)
  adminStats = [
    { label: 'Tổng Lớp học', value: '128' },
    { label: 'Tổng Học sinh', value: '4,520' },
    { label: 'Tổng Giáo viên', value: '86' },
    { label: 'Câu hỏi trong kho', value: '15.2k' }
  ];

  weakStudents = [
    { name: 'Nguyễn Văn A', class: '12A1', weakPoint: 'Giải tích' },
    { name: 'Trần Thị B', class: '10C2', weakPoint: 'Từ vựng tiếng Anh' }
  ];

  studentSkills = [
    { subject: 'Toán học', percent: 75 },
    { subject: 'Tiếng Anh', percent: 45 },
    { subject: 'Vật lý', percent: 90 }
  ];

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.user = this.auth.getUser();
    this.setWelcomeMessage();
  }

  setWelcomeMessage() {
    if (this.user?.role === 'ADMIN') {
      this.welcomeMessage = 'Hôm nay hệ thống có 250 lượt truy cập mới.';
    } else if (this.user?.role === 'TEACHER') {
      this.welcomeMessage = 'Có 2 bài thi vừa kết thúc cần bạn nhận xét.';
    } else {
      this.welcomeMessage = 'Bạn đã hoàn thành 80% mục tiêu học tập tuần này!';
    }
  }
}
>>>>>>> 7831c51b0f00e6b70f4c2d7230e7bc7f04f9e0b5
