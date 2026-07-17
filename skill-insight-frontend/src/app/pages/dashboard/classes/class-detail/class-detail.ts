import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterModule, Router } from '@angular/router';

import {
  ActivatedRoute
} from '@angular/router';

import {
  ClassService
} from '../../../../services/class.service';

import {
  AssignmentService
} from '../../../../services/assignment.service'

import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-class-detail',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],

  templateUrl: './class-detail.html',

  styleUrl: './class-detail.css',
})
export class ClassDetail implements OnInit {

  // =========================
  // DATA
  // =========================
  classDetail: any = null;

  students: any[] = [];

  assignments: any[] = [];

  tab: 'stream' | 'classwork' | 'people' | 'settings' = 'stream';


  // =========================
  // UI
  // =========================
  loading = false;

  classId = 0;
  
  // =========================
  // CONSTRUCTOR
  // =========================
  constructor(
    private classService: ClassService,
    private assignmentService: AssignmentService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {

    this.classId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (this.classId) {

      this.loadClassDetail();
    }

    this.assignments = (this.classDetail?.assignments || []).map((a: any) => ({
      ...a,
      editing: false,
      changed: false
    }));


  }

  

  // =========================
  // LOAD DETAIL
  // =========================
  loadClassDetail(): void {

    this.loading = true;

    this.classService
      .getClassById(this.classId)
      .subscribe({

        next: (res: any) => {

          this.loading = false;

          console.log(
            'CLASS DETAIL:',
            res
          );

          this.classDetail =
            res?.data || res;

          this.students =
            this.classDetail?.students
            || [];

          this.assignments =
            this.classDetail?.assignments
            || [];

         this.assignments.forEach((item: any) => {

          item.start_at = this.formatDateTime(item.start_at);
          item.end_at = this.formatDateTime(item.end_at);

          item.oldStart = item.start_at;
          item.oldEnd = item.end_at;

          item.changed = false;

        });

        },

        error: (err: any) => {

          this.loading = false;

          console.error(
            'Load detail failed',
            err
          );
        }
      });
  }

  // =========================
  // GETTERS
  // =========================
  get studentCount(): number {

    return (
      this.students.length || 0
    );
  }

  get assignmentCount(): number {

    return (
      this.assignments.length || 0
    );
  }

  // =========================
  // COPY CODE
  // =========================
  copyClassCode(): void {

    const code =
      this.classDetail?.class_code;

    if (!code) {
      return;
    }

    navigator.clipboard
      .writeText(code);

    alert(
      'Đã sao chép mã lớp'
    );
  }

  // =========================
  // QR URL
  // =========================
  get qrUrl(): string {

    const code =
      this.classDetail?.class_code
      || '';

    const joinUrl =
      `https://skill-insight.vn/join/${code}`;

    return `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(joinUrl)}`;
  }

  // ======================================
  // TRẠNG THÁI BÀI KIỂM TRA
  // ======================================

  getAssignmentStatus(item: any): string {

    const now = new Date().getTime();

    const start = new Date(item.start_at).getTime();

    const end = new Date(item.end_at).getTime();

    if (now < start) {
      return 'Sắp diễn ra';
    }

    if (now >= start && now <= end) {
      return 'Đang diễn ra';
    }

    return 'Đã kết thúc';

  }

// ======================================
// MÀU TRẠNG THÁI
// ======================================

getAssignmentStatusClass(item: any) {

  const status = this.getAssignmentStatus(item);

  return {

    'bg-yellow-100 text-yellow-700':
      status === 'Sắp diễn ra',

    'bg-green-100 text-green-700':
      status === 'Đang diễn ra',

    'bg-gray-100 text-gray-700':
      status === 'Đã kết thúc'

  };

}

// ======================================
// LƯU THỜI GIAN
// ======================================

saveAssignment(item: any): void {

  const payload = {
    start_at: item.start_at,
    end_at: item.end_at
  };

  this.assignmentService
    .updateAssignment(item.assignment_id, payload)
    .subscribe({

      next: () => {

        // tắt chế độ chỉnh sửa
        item.editing = false;

        // ẩn nút Lưu
        item.changed = false;

        // cập nhật giá trị gốc
        item.oldStart = item.start_at;
        item.oldEnd = item.end_at;

        alert('Đã cập nhật thành công.');

      },

      error: (err: any) => {

        console.error(err);

        alert(
          err.error?.message ||
          'Không thể cập nhật.'
        );

      }

    });

}

// ======================================
// XEM BÀI KIỂM TRA
// ======================================

viewAssignment(id: number): void {

  this.router.navigate([

    '/dashboard/assignments',

    id

  ]);

}

// ======================================
// XEM KẾT QUẢ
// ======================================

viewResults(id: number): void {

  this.router.navigate([

    '/dashboard/assignment-results',

    id

  ]);

}

// ======================================
// KHÓA / MỞ LỚP
// ======================================

toggleJoinStatus(): void {

  const allowJoin =
    !this.classDetail.allow_join;

  this.classService
    .updateClass(
      this.classDetail.class_id,
      {

        allow_join: allowJoin

      }
    )
    .subscribe({

      next: () => {

        this.classDetail.allow_join =
          allowJoin;

        alert(

          allowJoin
            ? 'Đã mở lớp.'
            : 'Đã khóa lớp.'

        );

      },

      error: err => {

        console.error(err);

        alert(

          err.error?.message ||

          'Không thể cập nhật.'

        );

      }

    });

}

// ======================================
// XUẤT ĐIỂM
// ======================================

exportScores(): void {

  this.assignmentService
    .exportScores(
      this.classDetail.class_id
    )
    .subscribe({

      next: (blob: any) => {

        const url =
          window.URL.createObjectURL(blob);

        const a =
          document.createElement('a');

        a.href = url;

        a.download =
          `${this.classDetail.class_name}-scores.xlsx`;

        a.click();

        window.URL.revokeObjectURL(url);

      },

      error: err => {

        console.error(err);

        alert(

          err.error?.message ||

          'Xuất điểm thất bại.'

        );

      }

    });

}


changeTab(
  tab: 'stream' | 'classwork' | 'people' | 'settings'
  ): void {

    this.tab = tab;

    localStorage.setItem('classTab', tab);

  }
  
  formatDate(date: string) {

  if (!date) return '-';

  return new Date(date).toLocaleString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

}

formatDateTime(date: string) {

  if (!date) return '';

  return new Date(date)
    .toISOString()
    .slice(0,16);

}

editAssignment(item: any) {

  item.oldStart = item.start_at;
  item.oldEnd = item.end_at;

  item.editing = true;

}

onDateChange(item: any): void {

  item.changed =
    item.start_at !== item.oldStart ||
    item.end_at !== item.oldEnd;

}

cancelEdit(item: any) {

  item.start_at = item.oldStart;
  item.end_at = item.oldEnd;

  item.changed = false;
  item.editing = false;

}

}