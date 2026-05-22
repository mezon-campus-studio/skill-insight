import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import {
  Router,
  RouterModule
} from '@angular/router';

import {
  ClassService
} from '../../../../services/class.service';

@Component({
  selector: 'app-class-create',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],

  templateUrl: './class-create.html',

  styleUrl: './class-create.css',
})
export class ClassCreate implements OnInit {

  // =========================
  // FORM
  // =========================
  classData = {

    // BASIC
    class_name: '',

    description: '',

    school_year: '2025 - 2026',

    teacher_id: 1,

    // JOIN
    class_code: '',

    allow_student_join: true,

    // UI
    background_color: '#2563eb'
  };

  // =========================
  // UI
  // =========================
  loading = false;

  generatedQrUrl = '';

  joinLink = '';

  // =========================
  // COLORS
  // =========================
  colorPresets = [
    '#2563eb',
    '#7c3aed',
    '#059669',
    '#ea580c',
    '#dc2626',
    '#0891b2',
    '#db2777',
    '#4f46e5'
  ];

  // =========================
  // CONSTRUCTOR
  // =========================
  constructor(

    private classService: ClassService,

    private router: Router

  ) {}

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {

    this.generateClassCode();
  }

  // =========================
  // GENERATE CODE
  // =========================
  generateClassCode(): void {

    const chars =
      'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

    let code = '';

    for (let i = 0; i < 8; i++) {

      code += chars.charAt(
        Math.floor(
          Math.random() * chars.length
        )
      );
    }

    this.classData.class_code = code;

    this.generateQr();
  }

  // =========================
  // GENERATE QR
  // =========================
  generateQr(): void {

    this.joinLink =
      `http://localhost:4200/join/${this.classData.class_code}`;

    this.generatedQrUrl =
      `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(this.joinLink)}`;
  }

  // =========================
  // SELECT COLOR
  // =========================
  selectColor(
    color: string
  ): void {

    this.classData
      .background_color = color;
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

    return true;
  }

  // =========================
  // CREATE CLASS
  // =========================
  createClass(): void {

    if (
      !this.validateForm()
    ) {
      return;
    }

    this.loading = true;

    const payload = {

      class_name:
        this.classData
          .class_name
          .trim(),

      description:
        this.classData
          .description,

      school_year:
        this.classData
          .school_year,

      teacher_id:
        Number(
          this.classData
            .teacher_id
        ),

      class_code:
        this.classData
          .class_code,

      allow_student_join:
        this.classData
          .allow_student_join,

      background_color:
        this.classData
          .background_color
    };

    console.log(
      'CREATE CLASS:',
      payload
    );

    this.classService
      .createClass(payload)
      .subscribe({

        next: (res: any) => {

          this.loading = false;

          console.log(res);

          alert(
            'Tạo lớp thành công'
          );

          this.router.navigate([
            '/dashboard/classes'
          ]);
        },

        error: (err: any) => {

          this.loading = false;

          console.error(err);

          alert(
            err?.error?.message
            || 'Tạo lớp thất bại'
          );
        }
      });
  }
}