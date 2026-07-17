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
  NgSelectModule
} from '@ng-select/ng-select';

import {
  QuestionBatchService
} from '../../../../services/question-batch.service';

import {
  SubjectService
} from '../../../../services/subject.service';

import {
  TopicService
} from '../../../../services/topic.service';

@Component({
  selector: 'app-batch-list',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgSelectModule
  ],

  templateUrl: './batch-list.html',

  styleUrls: ['./batch-list.css']
})

export class BatchList
implements OnInit {

  // =====================================================
  // DATA
  // =====================================================

  batches: any[] = [];

  filteredBatches: any[] = [];

  paginatedBatches: any[] = [];

  subjects: any[] = [];

  topics: any[] = [];

  filteredTopics: any[] = [];

  // =====================================================
  // UI
  // =====================================================

  loading = false;

  deletingId: number | null = null;

  searchKeyword = '';

  selectedSubject: number | null = null;

  selectedTopic: number | null = null;

  selectedStatus: string | null = null;

  // =====================================================
  // PAGINATION
  // =====================================================

  currentPage = 1;

  itemsPerPage = 5;

  totalPages = 1;

  pages: number[] = [];

  // =====================================================
  // USER
  // =====================================================

  currentUserRole = '';

  currentUserId: number | null = null;

  // =====================================================
  // MULTI DELETE
  // =====================================================

  selectedBatchIds: number[] = [];

  selectAll = false;

  // =====================================================
  // STATUS
  // =====================================================

  statusOptions = [

    {
      label: 'Chờ duyệt',
      value: 'PENDING'
    },

    {
      label: 'Đã duyệt',
      value: 'APPROVED'
    }

  ];

  constructor(

    private batchService:
      QuestionBatchService,

    private subjectService:
      SubjectService,

    private topicService:
      TopicService,

    private router: Router

  ) {}

  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    const user =
      JSON.parse(
        localStorage.getItem('user') || '{}'
      );

    this.currentUserId =
      user.user_id || null;

    this.currentUserRole =
      (user.role || '').toLowerCase();

    this.loadSubjects();

    this.loadTopics();

    this.loadBatches();

  }

  // =====================================================
  // LOAD SUBJECTS
  // =====================================================

  loadSubjects(): void {

    this.subjectService
      .getAllSubjects()
      .subscribe({

        next: (res: any) => {

          this.subjects =
            Array.isArray(res)
              ? res
              : res.subjects || [];

        },

        error: (err: any) => {

          console.error(err);

        }

      });

  }

  // =====================================================
  // LOAD TOPICS
  // =====================================================

  loadTopics(): void {

    this.topicService
      .getAllTopics()
      .subscribe({

        next: (res: any) => {

          this.topics =
            Array.isArray(res)
              ? res
              : res.topics || [];

          this.filteredTopics =
            [...this.topics];

        },

        error: (err: any) => {

          console.error(err);

        }

      });

  }

  // =====================================================
  // LOAD BATCHES
  // =====================================================

  loadBatches(): void {

    this.loading = true;

    this.batchService
      .getAllBatches()
      .subscribe({

        next: (res: any) => {

          console.log(
            'BATCHES:',
            res
          );

          this.batches =
            res?.data || [];

          this.filteredBatches =
            [...this.batches];

          this.updatePagination();

          this.loading = false;

        },

        error: (err: any) => {

          console.error(err);

          this.loading = false;

        }

      });

  }

  // =====================================================
  // SUBJECT CHANGE
  // =====================================================

  onSubjectChange(): void {

    this.selectedTopic = null;

    if (!this.selectedSubject) {

      this.filteredTopics =
        [...this.topics];

    } else {

      this.filteredTopics =
        this.topics.filter(

          (topic) =>

            Number(topic.subject_id) ===
            Number(this.selectedSubject)

        );

    }

    this.filterBatches();

  }

  // =====================================================
  // FILTER
  // =====================================================

  filterBatches(): void {

    let data =
      [...this.batches];

    // SEARCH
    if (this.searchKeyword) {

      data = data.filter(

        (batch) =>

          batch.batch_name
            ?.toLowerCase()
            .includes(
              this.searchKeyword
                .toLowerCase()
            )

      );

    }

    // SUBJECT
    if (this.selectedSubject) {

      data = data.filter(

        (batch) =>

          Number(batch.subject_id) ===
          Number(this.selectedSubject)

      );

    }

    // TOPIC
    if (this.selectedTopic) {

      data = data.filter(

        (batch) =>

          Number(batch.topic_id) ===
          Number(this.selectedTopic)

      );

    }

    // STATUS
    if (this.selectedStatus) {

      data = data.filter(

        (batch) =>

          batch.status ===
          this.selectedStatus

      );

    }

    this.filteredBatches = data;

    this.currentPage = 1;

    this.updatePagination();

  }

  // =====================================================
  // PAGINATION
  // =====================================================

  updatePagination(): void {

    this.totalPages =
      Math.ceil(
        this.filteredBatches.length /
        this.itemsPerPage
      ) || 1;

    this.pages =
      Array.from(
        {
          length: this.totalPages
        },
        (_, i) => i + 1
      );

    const start =
      (this.currentPage - 1) *
      this.itemsPerPage;

    const end =
      start + this.itemsPerPage;

    this.paginatedBatches =
      this.filteredBatches.slice(
        start,
        end
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

  goToPage(page: number): void {

    this.currentPage = page;

    this.updatePagination();

  }

  // =====================================================
  // STT
  // =====================================================

  getRowNumber(index: number): number {

    return (
      (this.currentPage - 1) *
      this.itemsPerPage
    ) + index + 1;

  }

  // =====================================================
  // GET SUBJECT NAME
  // =====================================================

  getSubjectName(
    subjectId: number
  ): string {

    const subject =
      this.subjects.find(

        (s) =>

          s.subject_id ===
          subjectId

      );

    return subject
      ?.subject_name || 'Unknown';

  }

  // =====================================================
  // GET TOPIC NAME
  // =====================================================

  getTopicName(
    topicId: number
  ): string {

    const topic =
      this.topics.find(

        (t) =>

          t.topic_id ===
          topicId

      );

    return topic
      ?.topic_name || 'Unknown';

  }

  // =====================================================
  // NAVIGATE
  // =====================================================

  createBatch(): void {

    this.router.navigate([
      '/dashboard/question-batches/create'
    ]);

  }

  viewDetail(id: number): void {

    this.router.navigate([
      '/dashboard/question-batches',
      id
    ]);

  }

  reviewBatch(id: number): void {

    this.router.navigate([
      '/dashboard/question-batches/review',
      id
    ]);

  }

  // =====================================================
  // APPROVE
  // =====================================================

  approveBatch(id: number): void {

    const confirmApprove =
      confirm(
        'Duyệt batch này?'
      );

    if (!confirmApprove) {

      return;

    }

    const user =
      JSON.parse(
        localStorage.getItem('user') || '{}'
      );

    this.batchService
      .approveBatch(
        id,
        {
          user_id: user.user_id
        }
      )
      .subscribe({

        next: () => {

          this.batches =
            this.batches.map((b) => {

              if (
                b.batch_id === id
              ) {

                return {
                  ...b,
                  status: 'APPROVED'
                };

              }

              return b;

            });

          this.filterBatches();

          alert(
            'Duyệt batch thành công'
          );

        },

        error: (err: any) => {

          console.error(err);

          alert(
            err?.error?.message ||
            'Có lỗi xảy ra'
          );

        }

      });

  }

  // =====================================================
  // DELETE ONE
  // =====================================================

  deleteBatch(id: number): void {

    const confirmDelete =
      confirm(
        'Bạn có chắc muốn xoá batch này?'
      );

    if (!confirmDelete) {

      return;

    }

    this.deletingId = id;

    this.batchService
      .deleteQuestionBatch(id)
      .subscribe({

        next: () => {

          this.batches =
            this.batches.filter(

              (b) =>

                b.batch_id !== id

            );

          this.filterBatches();

          this.deletingId = null;

          alert(
            'Xoá batch thành công'
          );

        },

        error: (err: any) => {

          console.error(err);

          this.deletingId = null;

          alert(
            err?.error?.message ||
            'Có lỗi xảy ra'
          );

        }

      });

  }

  // =====================================================
  // SELECT ONE
  // =====================================================

  toggleSelectBatch(
    batchId: number
  ): void {

    const exists =
      this.selectedBatchIds.includes(
        batchId
      );

    if (exists) {

      this.selectedBatchIds =
        this.selectedBatchIds.filter(
          id => id !== batchId
        );

    } else {

      this.selectedBatchIds.push(
        batchId
      );

    }

  }

  // =====================================================
  // SELECT ALL
  // =====================================================

  toggleSelectAll(): void {

    this.selectAll =
      !this.selectAll;

    if (this.selectAll) {

      this.selectedBatchIds =
        this.paginatedBatches.map(
          b => b.batch_id
        );

    } else {

      this.selectedBatchIds = [];

    }

  }

  // =====================================================
  // DELETE MULTIPLE
  // =====================================================

  deleteSelectedBatches(): void {

    if (
      this.selectedBatchIds.length === 0
    ) {

      alert(
        'Vui lòng chọn batch'
      );

      return;

    }

    const confirmDelete =
      confirm(
        `Xoá ${this.selectedBatchIds.length} batch?`
      );

    if (!confirmDelete) {

      return;

    }

    const requests =
      this.selectedBatchIds.map(
        id =>
          this.batchService
            .deleteQuestionBatch(id)
            .toPromise()
      );

    Promise.all(requests)
      .then(() => {

        this.batches =
          this.batches.filter(

            (b) =>

              !this.selectedBatchIds.includes(
                b.batch_id
              )

          );

        this.selectedBatchIds = [];

        this.selectAll = false;

        this.filterBatches();

        alert(
          'Xoá nhiều batch thành công'
        );

      })
      .catch((err) => {

        console.error(err);

        alert(
          'Có lỗi khi xoá nhiều batch'
        );

      });

  }

  // =====================================================
  // DELETE ALL
  // =====================================================

  deleteAllBatches(): void {

    if (
      this.batches.length === 0
    ) {

      alert(
        'Không có batch nào'
      );

      return;

    }

    const confirmDelete =
      confirm(
        'Xoá TOÀN BỘ batch?'
      );

    if (!confirmDelete) {

      return;

    }

    const requests =
      this.batches.map(
        batch =>
          this.batchService
            .deleteQuestionBatch(
              batch.batch_id
            )
            .toPromise()
      );

    Promise.all(requests)
      .then(() => {

        this.batches = [];

        this.filteredBatches = [];

        this.paginatedBatches = [];

        this.selectedBatchIds = [];

        this.selectAll = false;

        this.updatePagination();

        alert(
          'Đã xoá toàn bộ batch'
        );

      })
      .catch((err) => {

        console.error(err);

        alert(
          'Có lỗi khi xoá toàn bộ'
        );

      });

  }

  // =====================================================
  // TRACK BY
  // =====================================================

  trackByBatchId(
    index: number,
    item: any
  ): number {

    return item.batch_id;

  }

}