
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
