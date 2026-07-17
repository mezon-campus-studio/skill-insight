import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  Router,
  RouterModule
} from '@angular/router';

import {
  QuestionBatchService
} from '../../../../services/question-batch.service';

import {
  QuestionBatch
} from '../../../../models/question-batch.model';

@Component({
  selector: 'app-question-bank',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './question-bank.html',
  styleUrl: './question-bank.css'
})

export class QuestionBank implements OnInit {

  // ======================================================
  // USER
  // ======================================================

  role = '';

  isTeacher = false;

  isAdmin = false;

  // ======================================================
  // DATA
  // ======================================================

  batches: QuestionBatch[] = [];

  filteredBatches: QuestionBatch[] = [];

  paginatedBatches: QuestionBatch[] = [];

  loading = false;

  // ======================================================
  // TAB
  // ======================================================

  activeTab:
    | 'MY'
    | 'SYSTEM'
    | 'ALL'
    | 'TEACHER'
    = 'MY';

  // ======================================================
  // FILTER
  // ======================================================

  searchKeyword = '';

  selectedSubject: number | null = null;

  // ======================================================
  // PAGINATION
  // ======================================================

  currentPage = 1;

  itemsPerPage = 10;

  totalPages = 1;

  pages: number[] = [];

  constructor(

    private batchService:
      QuestionBatchService,

    private router:
      Router

  ) {}

  ngOnInit(): void {

    const user = JSON.parse(

      localStorage.getItem('user') || '{}'

    );

    this.role = user.role;

    this.isTeacher =
      this.role === 'teacher';

    this.isAdmin =
      this.role === 'admin';

    if (this.isTeacher) {

      this.activeTab = 'MY';

    }

    if (this.isAdmin) {

      this.activeTab = 'ALL';

    }

    this.loadData();

  }

  // ======================================================
  // LOAD DATA
  // ======================================================

  loadData(): void {

    this.loading = true;

    let request;

    switch (this.activeTab) {

      case 'MY':

        request =
          this.batchService.getMyBatches();

        break;

      case 'SYSTEM':

        request =
          this.batchService.getSystemBatches();

        break;

      case 'TEACHER':

        request =
          this.batchService
            .getTeacherPublicBatches();

        break;

      case 'ALL':

      default:

        request =
          this.batchService
            .getAllBatches();

        break;

    }

    request.subscribe({

      next: (res: any) => {

        this.batches =
          res?.data || [];

        this.filteredBatches =
          [...this.batches];

        this.currentPage = 1;

        this.updatePagination();

        this.loading = false;

      },

      error: () => {

        this.loading = false;

      }

    });

  }

  // ======================================================
  // CHANGE TAB
  // ======================================================

  changeTab(
    tab:
      'MY'
    | 'SYSTEM'
    | 'ALL'
    | 'TEACHER'
  ): void {

    if (this.activeTab === tab) {

      return;

    }

    this.activeTab = tab;

    this.searchKeyword = '';

    this.selectedSubject = null;

    this.loadData();

  }

    // ======================================================
  // FILTER
  // ======================================================

  filterBatches(): void {

    let data = [...this.batches];

    // Search
    if (this.searchKeyword.trim()) {

      const keyword = this.searchKeyword
        .toLowerCase()
        .trim();

      data = data.filter(batch =>

        (batch.batch_name || '')
          .toLowerCase()
          .includes(keyword)

        ||

        (batch.description || '')
          .toLowerCase()
          .includes(keyword)

        ||

        (batch.subject?.subject_name || '')
          .toLowerCase()
          .includes(keyword)

      );

    }

    // Subject
    if (this.selectedSubject) {

      data = data.filter(

        batch =>

          batch.subject_id ===
          this.selectedSubject

      );

    }

    this.filteredBatches = data;

    this.currentPage = 1;

    this.updatePagination();

  }

  // ======================================================
  // PAGINATION
  // ======================================================

  updatePagination(): void {

    this.totalPages =

      Math.ceil(

        this.filteredBatches.length /

        this.itemsPerPage

      ) || 1;

    this.pages = Array.from(

      {

        length: this.totalPages

      },

      (_, index) => index + 1

    );

    const start =

      (this.currentPage - 1)

      * this.itemsPerPage;

    this.paginatedBatches =

      this.filteredBatches.slice(

        start,

        start + this.itemsPerPage

      );

  }

  nextPage(): void {

    if (

      this.currentPage <

      this.totalPages

    ) {

      this.currentPage++;

      this.updatePagination();

    }

  }

  previousPage(): void {

    if (

      this.currentPage > 1

    ) {

      this.currentPage--;

      this.updatePagination();

    }

  }

  goToPage(

    page: number

  ): void {

    this.currentPage = page;

    this.updatePagination();

  }

  // ======================================================
  // ACTION
  // ======================================================

  createBatch(): void {

    this.router.navigate([

      '/dashboard/question-batches/create'

    ]);

  }

  viewBatch(batchId: number): void {

    this.router.navigate([
      '/dashboard/question-batches',
      batchId,
      'view'
    ]);

  }

  editBatch(batchId: number): void {

    this.router.navigate([
      '/dashboard/question-batches',
      batchId,
      'edit'
    ]);

  }

  deleteBatch(

    batchId: number

  ): void {

    if (

      !confirm(

        'Bạn có chắc chắn muốn xóa bộ câu hỏi này?'

      )

    ) {

      return;

    }

    this.batchService

      .deleteQuestionBatch(

        batchId

      )

      .subscribe({

        next: () => {

          this.batches =

            this.batches.filter(

              batch =>

                batch.batch_id !== batchId

            );

          this.filterBatches();

        }

      });

  }

  requestIntegrate(batch: QuestionBatch): void {

    this.batchService
      .integrateBatch(batch.batch_id)
      .subscribe({

        next: () => {

          alert('Đã gửi yêu cầu tích hợp.');

          this.loadData();

        },

        error: (err) => {

          alert(
            err.error?.message ||
            'Không thể gửi yêu cầu'
          );

        }

      });

  }

  cancelIntegrate(batch: QuestionBatch): void {

    this.batchService
      .cancelIntegrate(batch.batch_id)
      .subscribe({

        next: () => {

          batch.allow_integrate = false;

          batch.visibility = 'PRIVATE';

          batch.status = 'PRIVATE';

        },

        error: err => {

          alert(
            err.error?.message ||
            'Không thể hủy yêu cầu'
          );

        }

      });

  }

  copyBatch(

    batchId: number

  ): void {

    this.batchService

      .copyBatch(

        batchId

      )

      .subscribe({

        next: () => {

          alert(

            'Đã sao chép bộ câu hỏi.'

          );

        }

      });

  }

  integrateBatch(
    batchId: number
  ): void {

    this.batchService
      .integrateBatch(batchId)
      .subscribe({

        next: () => {

          alert('Đã gửi yêu cầu tích hợp.');

          this.loadData();

        },

        error: (err) => {

          alert(
            err.error?.message ||
            'Không thể gửi yêu cầu.'
          );

        }

      });

  }

  // ======================================================
  // HELPER
  // ======================================================

  trackByBatch(

    index: number,

    batch: QuestionBatch

  ): number {

    return batch.batch_id;

  }

  getVisibilityLabel(visibility: string): string {

  switch (visibility) {

    case 'PRIVATE':
      return 'Riêng tư';

    case 'PUBLIC':
      return 'Công khai';

    case 'SYSTEM_BANK':
      return 'Ngân hàng hệ thống';

    default:
      return visibility;

  }

}

  getSourceLabel(source: string): string {

    switch (source) {

      case 'SYSTEM':
        return 'Hệ thống';

      case 'TEACHER':
        return 'Giáo viên';

      default:
        return '';

    }

  }


getStatusLabel(status: string): string {

  switch (status) {

    case 'PRIVATE':
      return 'Riêng tư';

    case 'PENDING':
      return 'Chờ duyệt';

    case 'APPROVED':
      return 'Đã duyệt';

    case 'REJECTED':
      return 'Từ chối';

    default:
      return status;

  }

}

approveBatch(batchId: number): void {

  this.batchService
    .approveBatch(batchId, {})
    .subscribe({

      next: () => {

        alert('Đã duyệt');

        this.loadData();

      },

      error: (err) => {

        alert(
          err.error?.message ||
          'Không thể duyệt'
        );

      }

    });

}

}