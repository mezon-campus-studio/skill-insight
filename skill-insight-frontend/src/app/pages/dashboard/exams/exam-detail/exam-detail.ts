import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  ActivatedRoute,
  Router,
  RouterModule
} from '@angular/router';

import {
  ExamService
} from '../../../../services/exam.service';

@Component({
  selector: 'app-exam-detail',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule
  ],

  templateUrl: './exam-detail.html',

  styleUrl: './exam-detail.css',
})
export class ExamDetail implements OnInit {

  // =========================
  // DATA
  // =========================
  exam: any = null;

  questions: any[] = [];

  // =========================
  // UI
  // =========================
  loading = true;

  examId = 0;

  // =========================
  // CONSTRUCTOR
  // =========================
  constructor(

    private route: ActivatedRoute,

    private router: Router,

    private examService: ExamService

  ) {}

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {

    this.examId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    if (!this.examId) {

      this.router.navigate([
        '/dashboard/exams'
      ]);

      return;
    }

    this.loadExamDetail();
  }

  // =========================
  // LOAD DETAIL
  // =========================
  loadExamDetail(): void {

    this.loading = true;

    this.examService
      .getExamById(this.examId)
      .subscribe({

        next: (res: any) => {

          console.log(
            'EXAM DETAIL:',
            res
          );

          this.exam =
            res?.data || res;

          this.questions =
            this.exam?.exam_questions || [];

          this.loading = false;
        },

        error: (err: any) => {

          console.error(
            'Load exam detail failed',
            err
          );

          this.loading = false;

          alert(
            err?.error?.message
            || 'Không thể tải chi tiết đề thi'
          );
        }
      });
  }

  // =========================
// DELETE QUESTION
// =========================
removeQuestion(
  examQuestionId: number,
  questionId: number
): void {

  const confirmed = confirm(
    'Xoá câu hỏi khỏi đề thi?'
  );

  if (!confirmed) {
    return;
  }

  this.examService
    .removeQuestionFromExam(
      this.examId,
      questionId
    )
    .subscribe({

      next: () => {

        this.questions =
          this.questions.filter(
            q =>
              q.exam_question_id
              !== examQuestionId
          );

        alert(
          'Đã xoá câu hỏi'
        );
      },

      error: (err: any) => {

        console.error(err);

        alert(
          err?.error?.message
          || 'Xoá câu hỏi thất bại'
        );
      }
    });
}

  // =========================
  // DELETE EXAM
  // =========================
  deleteExam(): void {

    const confirmed = confirm(
      'Xác nhận xoá đề thi này?'
    );

    if (!confirmed) {
      return;
    }

    this.examService
      .deleteExam(this.examId)
      .subscribe({

        next: () => {

          alert(
            'Đã xoá đề thi'
          );

          this.router.navigate([
            '/dashboard/exams'
          ]);
        },

        error: (err: any) => {

          console.error(err);

          alert(
            err?.error?.message
            || 'Xoá đề thi thất bại'
          );
        }
      });
  }

  // =========================
  // LABELS
  // =========================
  getQuestionTypeLabel(
    type: string
  ): string {

    switch (type) {

      case 'MULTIPLE_CHOICE':
        return 'Nhiều đáp án';

      case 'TRUE_FALSE':
        return 'Đúng / Sai';

      case 'ESSAY':
        return 'Tự luận';

      default:
        return 'Một đáp án';
    }
  }

  getLevelLabel(
    level: string
  ): string {

    switch (level) {

      case 'EASY':
        return 'Dễ';

      case 'MEDIUM':
        return 'Trung bình';

      case 'HARD':
        return 'Khó';

      default:
        return '---';
    }
  }

  getStatusLabel(
    status: string
  ): string {

    switch (status) {

      case 'PUBLISHED':
        return 'Đã xuất bản';

      case 'ARCHIVED':
        return 'Đã lưu trữ';

      default:
        return 'Nháp';
    }
  }

  // =========================
  // COUNTS
  // =========================
  get totalQuestions(): number {

    return this.questions.length;
  }

  get randomInfo(): string {

    if (!this.exam?.is_random) {
      return 'Đề cố định';
    }

    return `Random ${this.exam.random_question_count} câu / học sinh`;
  }
}