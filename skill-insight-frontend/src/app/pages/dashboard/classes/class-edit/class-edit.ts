import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterModule
} from '@angular/router';

import {
  ClassService
} from '../../../../services/class.service';

@Component({
  selector: 'app-class-edit',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],

  templateUrl: './class-edit.html',

  styleUrl: './class-edit.css',
})
export class ClassEdit implements OnInit {

  // =========================
  // FORM
  // =========================
  classData = {

    class_name: '',

    description: '',

    class_code: '',

    teacher_id: 1
  };

  // =========================
  // UI
  // =========================
  loading = false;

  saving = false;

  classId = 0;

  generatedQrUrl = '';

  // =========================
  // CONSTRUCTOR
  // =========================
  constructor(

    private route: ActivatedRoute,

    private router: Router,

    private classService: ClassService

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

          const data =
            res?.data || res;

          console.log(
            'CLASS DETAIL:',
            data
          );

          this.classData = {

            class_name:
              data?.class_name || '',

            description:
              data?.description || '',

            class_code:
              data?.class_code || '',

            teacher_id:
              data?.teacher_id || 1
          };

          this.generateQr();
        },

        error: (err: any) => {

          this.loading = false;

          console.error(
            'Load class failed',
            err
          );

          alert(
            'Không thể tải lớp học'
          );
        }
      });
  }

  // =========================
  // GENERATE NEW CODE
  // =========================
  generateNewCode(): void {

    const chars =
      'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    let code = '';

    for (let i = 0; i < 10; i++) {

      code += chars.charAt(
        Math.floor(
          Math.random() * chars.length
        )
      );
    }

    this.classData.class_code =
      code;

    this.generateQr();
  }

  // =========================
  // GENERATE QR
  // =========================
  generateQr(): void {

    const joinUrl =
      `https://skill-insight.vn/join/${this.classData.class_code}`;

    this.generatedQrUrl =
      `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(joinUrl)}`;
  }

  // =========================
  // COPY CODE
  // =========================
  copyClassCode(): void {

    navigator.clipboard.writeText(
      this.classData.class_code
    );

    alert(
      'Đã sao chép mã lớp'
    );
  }

  // =========================
  // VALIDATE
  // =========================
  validateForm(): boolean {

    if (
      !this.classData
        .class_name
        .trim()
    ) {

      alert(
        'Vui lòng nhập tên lớp'
      );

      return false;
    }

    if (
      this.classData
        .class_name
        .trim()
        .length < 3
    ) {

      alert(
        'Tên lớp quá ngắn'
      );

      return false;
    }

    if (
      !this.classData
        .class_code
        .trim()
    ) {

      alert(
        'Mã lớp không hợp lệ'
      );

      return false;
    }

    return true;
  }

  // =========================
  // UPDATE CLASS
  // =========================
  updateClass(): void {

    if (
      !this.validateForm()
    ) {
      return;
    }

    this.saving = true;

    const payload = {

      class_name:
        this.classData
          .class_name
          .trim(),

      description:
        this.classData
          .description,

      class_code:
        this.classData
          .class_code,

      teacher_id:
        Number(
          this.classData
            .teacher_id
        )
    };

    console.log(
      'UPDATE CLASS:',
      payload
    );

    this.classService
      .updateClass(
        this.classId,
        payload
      )
      .subscribe({

        next: (res: any) => {

          this.saving = false;

          console.log(res);

          alert(
            'Cập nhật lớp học thành công'
          );

          this.router.navigate([
            '/dashboard/classes'
          ]);
        },

        error: (err: any) => {

          this.saving = false;

          console.error(err);

          alert(
            err?.error?.message
            || 'Cập nhật lớp thất bại'
          );
        }
      });
  }
}