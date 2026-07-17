import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AssignmentService } from '../../../../services/assignment.service'

@Component({
  selector: 'app-assignment-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './assignment-detail.html',
  styleUrl: './assignment-detail.css'
})
export class AssignmentDetail implements OnInit {

  assignmentId = 0;

  loading = false;

  assignment: any = null;

  selectedFile: File | null = null;

  comment = '';

  submitted = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private assignmentService: AssignmentService
  ) {}

  ngOnInit(): void {

    this.assignmentId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.loadAssignment();

  }

  loadAssignment(): void {

    this.loading = true;

    this.assignmentService
        .getById(this.assignmentId)
        .subscribe({

          next: (res: any) => {

            this.loading = false;

            this.assignment =
                res.data ?? res;

          },

          error: err => {

            this.loading = false;

            console.error(err);

          }

        });

  }

  get isExam(): boolean {

    return !!this.assignment?.exam;

  }

  get status(): string {

    if (!this.assignment) {

      return '';

    }

    const now = new Date();

    const start =
      new Date(this.assignment.start_at);

    const end =
      new Date(this.assignment.end_at);

    if (now < start) {

      return 'Chưa mở';

    }

    if (now > end) {

      return 'Đã kết thúc';

    }

    return 'Đang diễn ra';

  }

  get statusClass(): any {

    return {

      'bg-green-100 text-green-700':
        this.status === 'Đang diễn ra',

      'bg-red-100 text-red-700':
        this.status === 'Đã kết thúc',

      'bg-yellow-100 text-yellow-700':
        this.status === 'Chưa mở'

    };

  }

  chooseFile(event: any): void {

    if (
      event.target.files &&
      event.target.files.length
    ) {

      this.selectedFile =
        event.target.files[0];

    }

  }

  submitAssignment(): void {

    if (!this.selectedFile) {

      alert('Vui lòng chọn tệp.');

      return;

    }

    console.log(this.selectedFile);

    // TODO
    // upload API

    this.submitted = true;

    alert('Đã nộp bài.');

  }

  removeSubmission(): void {

    this.selectedFile = null;

    this.submitted = false;

  }

  addComment(): void {

    if (!this.comment.trim()) {

      return;

    }

    console.log(this.comment);

    // TODO
    // API comment

    alert('Đã thêm nhận xét.');

    this.comment = '';

  }

  startExam(): void {

    this.router.navigate([
      '/dashboard/student/my-exams',
      this.assignment.assignment_id
    ]);

  }

  goBack(): void {

    this.router.navigate([
      '/dashboard/my-classes'
    ]);

  }

}