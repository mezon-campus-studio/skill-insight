import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import {
  ActivatedRoute
} from '@angular/router';

import {
  ClassService
} from '../../../../services/class.service';

@Component({
  selector: 'app-class-detail',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule
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

  // =========================
  // UI
  // =========================
  loading = false;

  classId = 0;

  // =========================
  // CONSTRUCTOR
  // =========================
  constructor(

    private route: ActivatedRoute,

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
}