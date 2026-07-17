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
  QuestionBatchService
} from '../../../../services/question-batch.service';

import {
  FormsModule
} from '@angular/forms';

@Component({
  selector: 'app-question-batch-view',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './question-batch-view.html',
  styleUrl: './question-batch-view.css'
})
export class QuestionBatchView implements OnInit {

  batchId = 0;

  loading = false;

  batch: any = null;

  questions: any[] = [];

  isTeacher = true;

  isAdmin = true;
  currentUserId = 0;

  constructor(

    private route: ActivatedRoute,

    private router: Router,

    private batchService: QuestionBatchService

  ) {}

  ngOnInit(): void {

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    this.currentUserId = user.user_id;

    this.batchId = Number(

      this.route.snapshot.paramMap.get('id')

    );

    this.loadBatch();

  }

  get canEdit(): boolean {
    return this.batch?.teacher_id === this.currentUserId;
  }

  loadBatch(): void {

    this.loading = true;

    this.batchService
      .getQuestionBatchById(this.batchId)
      .subscribe({

        next: (res: any) => {

          this.batch = res.data;

          this.questions =
            (this.batch.questions || [])
              .map((item: any) => item.question);

          this.loading = false;

        },

        error: () => {

          this.loading = false;

        }

      });

  }

  back(): void {

    this.router.navigate([
      '/dashboard/question-bank'
    ]);

  }

  createExam(): void {

    this.router.navigate([
      '/dashboard/exams/create'
    ]);

  }

  edit(): void {

    if (!this.canEdit) {
      alert('Bạn không có quyền sửa bộ câu hỏi này.');
      return;
    }

    this.router.navigate([
      '/dashboard/question-batches',
      this.batchId,
      'edit'
    ]);

  }

  getLevelLabel(level: string): string {

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

  getLevelClass(level: string): string {

    switch (level) {

      case 'EASY':
        return 'bg-green-100 text-green-700';

      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700';

      case 'HARD':
        return 'bg-red-100 text-red-700';

      default:
        return 'bg-gray-100';

    }

  }

  getStatusLabel(status: string): string {

    switch (status) {

      case 'PENDING':
        return 'Chờ duyệt';

      case 'APPROVED':
        return 'Đã duyệt';

      case 'REJECTED':
        return 'Đã từ chối';

      default:
        return status;

    }

  }

}