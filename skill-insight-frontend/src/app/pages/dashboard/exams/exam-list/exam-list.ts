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
  ExamService
} from '../../../../services/exam.service';

import {
  Exam
} from '../../../../models/exam.model';

@Component({

  selector: 'app-exam-list',

  standalone: true,

  imports: [

    CommonModule,

    FormsModule,

    RouterModule

  ],

  templateUrl: './exam-list.html',

  styleUrl: './exam-list.css'

})

export class ExamList implements OnInit {

  // ======================================================
  // USER
  // ======================================================

  role = '';

  isTeacher = false;

  isAdmin = false;

  // ======================================================
  // DATA
  // ======================================================

  exams: Exam[] = [];

  filteredExams: Exam[] = [];

  paginatedExams: Exam[] = [];

  loading = false;
  showRejectModal = false;

  rejectReason = '';

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

  searchText = '';

  selectedSubject = '';

  selectedTopic = '';

  sortBy = 'newest';

  subjects: any[] = [];

  topics: any[] = [];

  // ======================================================
  // CHECKBOX
  // ======================================================

  selectedExamIds =
    new Set<number>();

  selectAll = false;

  // ======================================================
  // PAGINATION
  // ======================================================

  currentPage = 1;

  itemsPerPage = 10;

  totalPages = 1;

  pages: number[] = [];

  constructor(

    private examService: ExamService,

    private router: Router

  ) {}

  // ======================================================
  // INIT
  // ======================================================

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

    this.loadSubjects();

    this.loadExams();

  }

  // ======================================================
  // LOAD EXAMS
  // ======================================================

  loadExams(): void {

    this.loading = true;

    let request;

    switch (this.activeTab) {

      case 'MY':

        request =
          this.examService
            .getMyExams();

        break;

      case 'SYSTEM':

        request =
          this.examService
            .getSystemExams();

        break;

      case 'TEACHER':

        request =
          this.examService
            .getTeacherExams();

        break;

      case 'ALL':

      default:

        request =
          this.examService
            .getAllExams();

        break;

    }

    request.subscribe({

      next: (res: any) => {

        this.exams =
          res?.data || [];

          console.log(this.exams);
          
        this.filteredExams =
          [...this.exams];

        this.currentPage = 1;

        this.updatePagination();

        this.loading = false;

      },

      error: err => {

        console.error(err);

        this.loading = false;

      }

    });

  }

  // ======================================================
  // CHANGE TAB
  // ======================================================

  changeTab(

    tab:
      | 'MY'
      | 'SYSTEM'
      | 'ALL'
      | 'TEACHER'

  ): void {

    if (this.activeTab === tab) {

      return;

    }

    this.activeTab = tab;

    this.searchText = '';

    this.selectedSubject = '';

    this.selectedTopic = '';

    this.loadExams();

  }

  // ======================================================
  // SUBJECT
  // ======================================================

  loadSubjects(): void {

    this.examService

      .getSubjects()

      .subscribe({

        next: (res: any) => {

          this.subjects =
            res?.data || [];

        }

      });

  }

  // ======================================================
  // TOPIC
  // ======================================================

  onSubjectChange(): void {

    this.selectedTopic = '';

    this.topics = [];

    if (!this.selectedSubject) {

      this.applyFilter();

      return;

    }

    this.examService

      .getTopics(

        Number(this.selectedSubject)

      )

      .subscribe({

        next: (res: any) => {

          this.topics =
            res?.data || [];

          this.applyFilter();

        }

      });

  }

  
  // ======================================================
  // FILTER
  // ======================================================

  applyFilter(): void {

    let data = [...this.exams];

    // SEARCH

    if (this.searchText.trim()) {

      const keyword =

        this.searchText

          .toLowerCase()

          .trim();

      data = data.filter(

        exam =>

          (exam.title || '')

            .toLowerCase()

            .includes(keyword)

      );

    }

    // SUBJECT

    if (this.selectedSubject) {

      data = data.filter(

        exam =>

          String(exam.subject_id)

          ===

          this.selectedSubject

      );

    }

    // TOPIC

    if (this.selectedTopic) {

      data = data.filter(

        exam =>

          String(exam.topic_id)

          ===

          this.selectedTopic

      );

    }

    // SORT

    switch (this.sortBy) {

      case 'oldest':

        data.sort(

          (a, b) =>

            new Date(a.created_at).getTime()

            -

            new Date(b.created_at).getTime()

        );

        break;

      case 'question_desc':

        data.sort(

          (a, b) =>

            this.getQuestionCount(b)

            -

            this.getQuestionCount(a)

        );

        break;

      case 'random':

        data = data.filter(

          exam => exam.is_random

        );

        break;

      default:

        data.sort(

          (a, b) =>

            new Date(b.created_at).getTime()

            -

            new Date(a.created_at).getTime()

        );

    }

    this.filteredExams = data;

    this.selectedExamIds.clear();

    this.selectAll = false;

    this.currentPage = 1;

    this.updatePagination();

  }

  // ======================================================
  // PAGINATION
  // ======================================================

  updatePagination(): void {

    this.totalPages =

      Math.ceil(

        this.filteredExams.length

        /

        this.itemsPerPage

      ) || 1;

    this.pages = Array.from(

      {

        length: this.totalPages

      },

      (_, i) => i + 1

    );

    const start =

      (this.currentPage - 1)

      * this.itemsPerPage;

    this.paginatedExams =

      this.filteredExams.slice(

        start,

        start + this.itemsPerPage

      );

  }

  previousPage(): void {

    if (this.currentPage > 1) {

      this.currentPage--;

      this.updatePagination();

    }

  }

  nextPage(): void {

    if (this.currentPage < this.totalPages) {

      this.currentPage++;

      this.updatePagination();

    }

  }

  goToPage(page: number): void {

    this.currentPage = page;

    this.updatePagination();

  }

    // ======================================================
  // CHECKBOX
  // ======================================================

  toggleSelectAll(): void {

    if (this.selectAll) {

      this.paginatedExams.forEach(exam => {

        this.selectedExamIds.add(
          exam.exam_id
        );

      });

    }

    else {

      this.selectedExamIds.clear();

    }

  }

  toggleExam(id: number): void {

    if (this.selectedExamIds.has(id)) {

      this.selectedExamIds.delete(id);

    }

    else {

      this.selectedExamIds.add(id);

    }

  }

  // ======================================================
  // ACTION
  // ======================================================

  createExam(): void {

    this.router.navigate([
      '/dashboard/exams/create'
    ]);

  }

  viewExam(id: number): void {

    this.router.navigate([
      '/dashboard/exams',
      id,
      'view'
    ]);

  }

  detailExam(id: number): void {

    this.router.navigate([
      '/dashboard/exams',
      id,
      'detail'
    ]);

  }


  editExam(id: number): void {

    this.router.navigate([
      '/dashboard/exams',
      id,
      'edit'
    ]);

  }

  deleteExam(id: number): void {

    if (
      !confirm(
        'Bạn có chắc muốn xóa đề thi này?'
      )
    ) {

      return;

    }

    this.examService
      .deleteExam(id)
      .subscribe({

        next: () => {

          this.exams =
            this.exams.filter(

              exam =>

                exam.exam_id !== id

            );

          this.applyFilter();

        },

        error: err => {

          alert(

            err.error?.message ||

            'Không thể xóa đề thi.'

          );

        }

      });

  }

  deleteSelected(): void {

    if (

      this.selectedExamIds.size === 0

    ) {

      alert(

        'Vui lòng chọn đề.'

      );

      return;

    }

    if (

      !confirm(

        'Bạn có chắc muốn xóa?'

      )

    ) {

      return;

    }

    this.examService

      .deleteManyExams(

        Array.from(

          this.selectedExamIds

        )

      )

      .subscribe({

        next: () => {

          this.loadExams();

        }

      });

  }

  deleteAll(): void {

    if (!confirm('Xóa toàn bộ đề thi?')) {

      return;

    }

    this.examService
      .deleteAllExams()
      .subscribe({

        next: () => {

          this.loadExams();

        }

      });

  }

  // ======================================================
  // INTEGRATE
  // ======================================================

  requestIntegrate(exam: Exam): void {

    this.examService

      .integrateExam(

        exam.exam_id

      )

      .subscribe({

        next: () => {

          alert(

            'Đã gửi yêu cầu tích hợp.'

          );

          this.loadExams();

        },

        error: err => {

          alert(

            err.error?.message ||

            'Không thể gửi yêu cầu.'

          );

        }

      });

  }

  cancelIntegrate(exam: Exam): void {

    this.examService
    .cancelIntegrateExam(
        exam.exam_id
    )

      .subscribe({

        next: () => {

          alert(

            'Đã hủy yêu cầu.'

          );

          this.loadExams();

        },

        error: err => {

          alert(

            err.error?.message ||

            'Không thể hủy.'

          );

        }

      });

  }

  showIntegrationWarning(): void {

    alert(
      'Đề sẽ được gửi cho Admin xét duyệt.'
    );

  }

  approveExam(id: number): void {

    this.examService

      .approveExam(

        id,

        {}

      )

      .subscribe({

        next: () => {

          alert(

            'Đã duyệt.'

          );

          this.loadExams();

        },

        error: err => {

          alert(

            err.error?.message ||

            'Không thể duyệt.'

          );

        }

      });

  }

  rejectExam(id: number): void {

    const reason = prompt(

      'Lý do từ chối'

    );

    if (

      reason === null

    ) {

      return;

    }

    this.examService

      .rejectExam(

        id,

        {

          reason

        }

      )

      .subscribe({

        next: () => {

          alert(

            'Đã từ chối.'

          );

          this.loadExams();

        }

      });

  }

  copyExam(id: number): void {

  this.examService
    .copyExam(id)
    .subscribe({

      next: () => {

        alert('Sao chép đề thành công.');

        this.loadExams();

      },

      error: (err: any) => {

        alert(
          err.error?.message ||
          'Không thể sao chép đề.'
        );

      }

    });

}

  // ======================================================
  // HELPERS
  // ======================================================

  trackByExam(

    index: number,

    exam: Exam

  ): number {

    return exam.exam_id;

  }

  getQuestionCount(

    exam: Exam

  ): number {

    return (

      exam?._count?.exam_questions ||

      0

    );

  }

  getSubjectLabel(

    exam: Exam

  ): string {

    return (

      exam.subject?.subject_name ||

      ''

    );

  }

  getTopicLabel(

    exam: Exam

  ): string {

    return (

      exam.topic?.topic_name ||

      ''

    );

  }

  getSourceLabel(

    source: string

  ): string {

    switch (source) {

      case 'SYSTEM':

        return 'Hệ thống';

      case 'TEACHER':

        return 'Giáo viên';

      default:

        return '';

    }

  }

  getVisibilityLabel(

    visibility: string

  ): string {

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

  getStatusLabel(status: string): string {

    switch (status) {

      case 'DRAFT':
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

  get isEmpty(): boolean {

    return (

      this.filteredExams.length === 0

    );
  }

  showRejectReason(reason: string): void {

  this.rejectReason = reason;

  this.showRejectModal = true;

}

closeRejectModal(): void {

  this.showRejectModal = false;

  this.rejectReason = '';

}

}