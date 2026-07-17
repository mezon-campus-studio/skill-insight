import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { ExamService } from '../../../../services/exam.service';

@Component({
  selector: 'app-exam-view',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './exam-view.html',
  styleUrl: './exam-view.css'
})
export class ExamView implements OnInit {

  exam: any = null;

  loading = true;
  hasChanged = false;
  

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: ExamService
  ) {}

  ngOnInit(): void {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.examService
      .getExamById(id)
      .subscribe({

        next: (res: any) => {

          this.exam = res.data;

          this.loading = false;

        },

        error: () => {

          this.loading = false;

        }

      });

  }

  detailExam(): void {

    this.router.navigate([
      '/dashboard/exams',
      this.exam.exam_id,
      'detail'
    ]);

  }

  assignExam() {

    this.router.navigate([
      '/dashboard/assignments/create',
      this.exam.exam_id
    ]);

  }
  back(): void {

  this.router.navigate([
    '/dashboard/exams'
  ]);

}

getStatusLabel(status: string): string {

  switch (status) {

    case 'DRAFT':
      return 'Riêng tư';

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
}