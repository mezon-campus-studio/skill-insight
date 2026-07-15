import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterModule
} from '@angular/router';

import {
  AssignmentService
} from '../../../../services/assignment.service';

import {
  ExamService
} from '../../../../services/exam.service';

import {
  ClassService
} from '../../../../services/class.service';

@Component({
  selector: 'app-assignment-create',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],

  templateUrl: './assignment-create.html',

  styleUrl: './assignment-create.css',
})
export class AssignmentCreate
implements OnInit {

  // =========================
  // FORM
  // =========================
  assignmentData = {

    exam_id: '',

    class_id: '',

    start_time: '',

    end_time: '',

    max_attempts: 1,

    duration_override: null,

    password: '',

    // SECURITY
    require_fullscreen: true,

    detect_tab_switch: true,

    block_copy: true
  };

  // =========================
  // DATA
  // =========================
  exams: any[] = [];

  classes: any[] = [];

  selectedExam: any = null;

  // =========================
  // UI
  // =========================
  loading = false;

  // =========================
  // CONSTRUCTOR
  // =========================
  constructor(

    private assignmentService:
      AssignmentService,

    private examService:
      ExamService,

    private classService:
      ClassService,

    private route: ActivatedRoute,

    private router: Router

  ) {}

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {

      if (params['classId']) {

        this.assignmentData.class_id =
          String(params['classId']);

      }

    });

    this.loadExams();
    this.loadClasses();

  }

  // =========================
  // LOAD EXAMS
  // =========================
  loadExams(): void {

    this.examService
      .getExams()
      .subscribe({

        next: (res: any) => {

          console.log(
            'EXAMS:',
            res
          );

          this.exams =
            res?.data || [];
        },

        error: (err: any) => {

          console.error(
            'Load exams failed',
            err
          );
        }
      });
  }

  // =========================
  // LOAD CLASSES
  // =========================
  loadClasses(): void {

    this.classService
      .getMyClasses()
      .subscribe({

        next: (res: any) => {

          this.classes = res.data || [];

        },

        error: err => console.error(err)

      });

  }

  // =========================
  // EXAM CHANGE
  // =========================
  onExamChange(): void {

    this.selectedExam =
      this.exams.find(
        e =>
          String(e.exam_id)
          === this.assignmentData.exam_id
      );

    console.log(
      'SELECTED EXAM:',
      this.selectedExam
    );
  }

  // =========================
  // VALIDATE
  // =========================
  validateForm(): boolean {

    if (
      !this.assignmentData.exam_id
    ) {

      alert(
        'Vui lòng chọn đề thi'
      );

      return false;
    }

    if (
      !this.assignmentData.class_id
    ) {

      alert(
        'Vui lòng chọn lớp học'
      );

      return false;
    }

    if (
      !this.assignmentData.start_time
    ) {

      alert(
        'Vui lòng chọn thời gian mở đề'
      );

      return false;
    }

    if (
      !this.assignmentData.end_time
    ) {

      alert(
        'Vui lòng chọn thời gian đóng đề'
      );

      return false;
    }

    const start =
      new Date(
        this.assignmentData.start_time
      ).getTime();

    const end =
      new Date(
        this.assignmentData.end_time
      ).getTime();

    if (end <= start) {

      alert(
        'Thời gian đóng đề phải lớn hơn thời gian mở đề'
      );

      return false;
    }

    if (
      Number(
        this.assignmentData.max_attempts
      ) <= 0
    ) {

      alert(
        'Số lần làm không hợp lệ'
      );

      return false;
    }

    return true;
  }

  // =========================
  // CREATE ASSIGNMENT
  // =========================
  createAssignment(): void {

    if (
      !this.validateForm()
    ) {
      return;
    }

    this.loading = true;

    const payload = {

      exam_id:
        Number(
          this.assignmentData.exam_id
        ),

      class_id:
        Number(
          this.assignmentData.class_id
        ),

      start_time:
        this.assignmentData.start_time,

      end_time:
        this.assignmentData.end_time,

      max_attempts:
        Number(
          this.assignmentData.max_attempts
        ),

      duration_override:
        this.assignmentData
          .duration_override
          ? Number(
              this.assignmentData
                .duration_override
            )
          : null,

      password:
        this.assignmentData.password
          ?.trim() || null,

      // SECURITY
      require_fullscreen:
        this.assignmentData
          .require_fullscreen,

      detect_tab_switch:
        this.assignmentData
          .detect_tab_switch,

      block_copy:
        this.assignmentData
          .block_copy
    };

    console.log(
      'CREATE ASSIGNMENT:',
      payload
    );

    this.assignmentService
      .createAssignment(payload)
      .subscribe({

        next: (res: any) => {

          this.loading = false;

          console.log(res);

          alert(
            'Giao đề thi thành công'
          );

          this.router.navigate([
            '/dashboard/assignments'
          ]);
        },

        error: (err: any) => {

          this.loading = false;

          console.error(err);

          alert(
            err?.error?.message
            || 'Giao đề thất bại'
          );
        }
      });
  }
}