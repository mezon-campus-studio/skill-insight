import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  Router,
  RouterModule
} from '@angular/router';

import {
  AuthService
} from '../../../../services/auth.service';

import {
  ExamService
} from '../../../../services/exam.service';

import {
  Exam
} from '../../../../models/exam.model';
import { FormsModule } from '@angular/forms';

@Component({

  selector: 'app-exam-detail',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],

  templateUrl: './exam-detail.html',

  styleUrl: './exam-detail.css'

})

export class ExamDetail implements OnInit {

  // ======================================================
  // USER
  // ======================================================

  role = '';

  isTeacher = false;

  isAdmin = false;

  canEdit = false;

  // ======================================================
  // DATA
  // ======================================================

  exam!: Exam;

  questions: any[] = [];

  examId = 0;

  // ======================================================
  // UI
  // ======================================================

  loading = true;
  hasChanged = false;

  markChanged(): void {
    this.hasChanged = true;
  }

  private originalExam = '';

  // ======================================================
  // CONSTRUCTOR
  // ======================================================

  constructor(

    private route: ActivatedRoute,

    private router: Router,

    private authService: AuthService,

    private examService: ExamService

  ) {}

  // ======================================================
  // INIT
  // ======================================================

  ngOnInit(): void {

    const user =
      this.authService.getCurrentUser();

    this.role = user?.role || '';

    this.isTeacher =
      this.role === 'teacher';

    this.isAdmin =
      this.role === 'admin';

    this.canEdit =
      this.isTeacher || this.isAdmin;

    this.examId = Number(

      this.route.snapshot.paramMap.get('id')

    );

    if (!this.examId) {

      this.router.navigate([
        '/dashboard/exams'
      ]);

      return;

    }

    this.loadExam();

  }

  // ======================================================
  // LOAD EXAM
  // ======================================================

  loadExam(): void {

  this.loading = true;

  this.examService
    .getExamById(this.examId)
    .subscribe({

      next: (res: any) => {

        this.exam = res.data;

        this.questions = (this.exam.exam_questions || []).map((eq: any) => {

          const answers = eq.question?.answers || [];

          return {

            question_id: eq.question.question_id,

            content: eq.question.content,

            explanation: eq.question.explanation,

            difficulty: eq.question.level,

            answer_a: answers[0]?.answer_text || '',

            answer_b: answers[1]?.answer_text || '',

            answer_c: answers[2]?.answer_text || '',

            answer_d: answers[3]?.answer_text || '',

            correct_answer:
              answers.find((a: any) => a.is_correct)?.answer_order === 1 ? 'A' :
              answers.find((a: any) => a.is_correct)?.answer_order === 2 ? 'B' :
              answers.find((a: any) => a.is_correct)?.answer_order === 3 ? 'C' :
              answers.find((a: any) => a.is_correct)?.answer_order === 4 ? 'D' :
              'A'

          };

        });

        this.originalExam = JSON.stringify({

          exam: this.exam,

          questions: this.questions

        });

        console.log('EXAM:', this.exam);

        console.log('QUESTION RAW:', this.exam.exam_questions);

        console.log('QUESTION MAP:', this.questions);

        this.loading = false;

      },

      error: (err) => {

        console.error(err);

        this.loading = false;

        alert(

          err.error?.message ||

          'Không tải được đề thi.'

        );

      }

    });

}

  // ======================================================
  // NAVIGATION
  // ======================================================

  back(): void {

    this.router.navigate([
      '/dashboard/exams'
    ]);

  }

  editExam(): void {

    this.router.navigate([
      '/dashboard/exams',
      this.exam.exam_id,
      'edit'
    ]);

  }

  checkChanged(): void {

    const current = JSON.stringify({
      exam: this.exam,
      questions: this.questions
    });

    this.hasChanged = current !== this.originalExam;

  }

  assignExam(): void {

    this.router.navigate([
      '/dashboard/assignments/create',
      this.exam.exam_id
    ]);

  }

  addQuestion(): void {

    this.router.navigate([
      '/dashboard/questions/create'
    ], {

      queryParams: {

        examId: this.exam.exam_id

      }

    });

  }

    // ======================================================
  // EDIT QUESTION
  // ======================================================

  editQuestion(question: any): void {

    this.router.navigate([
      '/dashboard/questions/edit',
      question.question_id
    ]);

  }

  // ======================================================
  // REMOVE QUESTION
  // ======================================================

  removeQuestion(index: number): void {

    const q = this.questions[index];

    const questionId =
      q.question?.question_id ??
      q.question_id;

    if (!questionId) {

      this.questions.splice(index, 1);

      return;

    }

    const ok = confirm(
      'Bạn có chắc muốn xoá câu hỏi khỏi đề thi?'
    );

    if (!ok) {
      return;
    }

    this.examService
      .removeQuestionFromExam(
        this.examId,
        questionId
      )
      .subscribe({

        next: () => {

          this.questions.splice(
            index,
            1
          );

          alert(
            'Đã xoá câu hỏi.'
          );

        },

        error: (err: any) => {

          console.error(err);

          alert(
            err.error?.message ||
            'Không thể xoá câu hỏi.'
          );

        }

      });

  }

  updateExam(){

   this.examService
       .updateExam(this.examId,{
           ...this.exam,
           questions:this.questions
       })
       .subscribe({

          next:()=>{

              alert("Cập nhật thành công");

              this.originalExam = JSON.stringify({
                  exam:this.exam,
                  questions:this.questions
              });

              this.hasChanged=false;

          }

       });

}

  // ======================================================
  // DELETE EXAM
  // ======================================================

  deleteExam(): void {

    const ok = confirm(
      'Bạn có chắc muốn xoá đề thi này?'
    );

    if (!ok) {
      return;
    }

    this.examService
      .deleteExam(
        this.exam.exam_id
      )
      .subscribe({

        next: () => {

          alert(
            'Đã xoá đề thi.'
          );

          this.router.navigate([
            '/dashboard/exams'
          ]);
        },

        error: (err: any) => {

          console.error(err);

          alert(
            err.error?.message ||
            'Không thể xoá đề thi.'
          );

        }

      });

  }

  // ======================================================
  // LABEL
  // ======================================================

  getStatusLabel(
    status: string
  ): string {

    switch (status) {

      case 'DRAFT':
        return 'Nháp';

      case 'PENDING':
        return 'Chờ duyệt';

      case 'APPROVED':
        return 'Đã duyệt';

      case 'REJECTED':
        return 'Bị từ chối';

      default:
        return status;

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
        return level;

    }

  }

  getQuestionTypeLabel(
    type: string
  ): string {

    switch (type) {

      case 'SINGLE_CHOICE':
        return 'Một đáp án';

      case 'MULTIPLE_CHOICE':
        return 'Nhiều đáp án';

      case 'TRUE_FALSE':
        return 'Đúng / Sai';

      case 'ESSAY':
        return 'Tự luận';

      default:
        return type;

    }

  }

  // ======================================================
  // GETTERS
  // ======================================================

  get totalQuestions(): number {

    return this.questions.length;

  }

  get randomInfo(): string {

    if (!this.exam?.is_random) {

      return 'Đề cố định';

    }

    return `Random ${this.exam.random_question_count} câu`;

  }

}