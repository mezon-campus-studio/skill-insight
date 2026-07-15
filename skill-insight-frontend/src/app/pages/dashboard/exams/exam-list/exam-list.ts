import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { RouterModule } from '@angular/router';

import { ExamService } from '../../../../services/exam.service';

@Component({
  selector: 'app-exam-list',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],

  templateUrl: './exam-list.html',

  styleUrl: './exam-list.css',
})
export class ExamList implements OnInit {

  // =========================
  // DATA
  // =========================
  exams: any[] = [];

  filteredExams: any[] = [];

  paginatedExams: any[] = [];

  // =========================
  // FILTER
  // =========================
  searchText = '';

  selectedSubject = '';

  selectedTopic = '';

  sortBy = 'newest';

  // =========================
  // SUBJECT / TOPIC
  // =========================
  subjects: any[] = [];

  topics: any[] = [];

  // =========================
  // CHECKBOX
  // =========================
  selectedExamIds: Set<number> =
    new Set();

  selectAll = false;

  // =========================
  // PAGINATION
  // =========================
  currentPage = 1;

  itemsPerPage = 5;

  totalPages = 1;

  // =========================
  // UI
  // =========================
  loading = false;

  // =========================
  // CONSTRUCTOR
  // =========================
  constructor(
    private examService: ExamService
  ) {}

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {

    this.loadSubjects();

    this.loadExams();
  }

  // =========================
  // LOAD EXAMS
  // =========================
  loadExams(): void {

    this.loading = true;

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

          this.loading = false;

          this.applyFilter();
        },

        error: (err) => {

          this.loading = false;

          console.error(
            'Load exams failed',
            err
          );
        }
      });
  }

  // =========================
  // LOAD SUBJECTS
  // =========================
  loadSubjects(): void {

    this.examService
      .getSubjects()
      .subscribe({

        next: (res: any) => {

          this.subjects =
            res?.data || [];
        },

        error: (err) => {

          console.error(
            'Load subjects failed',
            err
          );
        }
      });
  }

  // =========================
  // LOAD TOPICS
  // =========================
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
        },

        error: (err) => {

          console.error(
            'Load topics failed',
            err
          );
        }
      });
  }

  // =========================
  // FILTER
  // =========================
  applyFilter(): void {

    let data = [...this.exams];

    // =========================
    // SEARCH
    // =========================
    if (this.searchText.trim()) {

      const keyword =
        this.searchText
          .toLowerCase();

      data = data.filter(
        exam =>
          (exam.title || '')
            .toLowerCase()
            .includes(keyword)
      );
    }

    // =========================
    // SUBJECT
    // =========================
    if (this.selectedSubject) {

      data = data.filter(
        exam =>
          String(exam.subject_id)
          === this.selectedSubject
      );
    }

    // =========================
    // TOPIC
    // =========================
    if (this.selectedTopic) {

      data = data.filter(
        exam =>
          String(exam.topic_id)
          === this.selectedTopic
      );
    }

    // =========================
    // SORT
    // =========================
    switch (this.sortBy) {

      case 'oldest':

        data.sort(
          (a, b) =>
            new Date(a.created_at)
              .getTime()
            -
            new Date(b.created_at)
              .getTime()
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
            new Date(b.created_at)
              .getTime()
            -
            new Date(a.created_at)
              .getTime()
        );

        break;
    }

    this.filteredExams = data;

    // RESET CHECKBOX
    this.selectedExamIds.clear();

    this.selectAll = false;

    this.resetPagination();
  }

  // =========================
  // PAGINATION
  // =========================
  resetPagination(): void {

    this.totalPages = Math.max(
      1,
      Math.ceil(
        this.filteredExams.length
        / this.itemsPerPage
      )
    );

    this.currentPage = 1;

    this.updatePagination();
  }

  updatePagination(): void {

    const start =
      (this.currentPage - 1)
      * this.itemsPerPage;

    const end =
      start + this.itemsPerPage;

    this.paginatedExams =
      this.filteredExams.slice(
        start,
        end
      );
  }

  goToPage(page: number): void {

    if (
      page < 1
      ||
      page > this.totalPages
    ) {
      return;
    }

    this.currentPage = page;

    this.updatePagination();
  }

  // =========================
  // CHECKBOX
  // =========================
  toggleSelectAll(): void {

    if (this.selectAll) {

      this.paginatedExams.forEach(
        exam => {

          this.selectedExamIds.add(
            exam.exam_id
          );
        }
      );

    } else {

      this.selectedExamIds.clear();
    }
  }

  toggleExam(id: number): void {

    if (
      this.selectedExamIds.has(id)
    ) {

      this.selectedExamIds.delete(id);

    } else {

      this.selectedExamIds.add(id);
    }
  }

  // =========================
  // DELETE ONE
  // =========================
  deleteExam(id: number): void {

    if (
      !confirm(
        'Xoá đề thi này?'
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

        error: (err) => {

          console.error(
            'Delete exam failed',
            err
          );

          alert(
            'Xóa đề thất bại'
          );
        }
      });
  }

  // =========================
  // DELETE SELECTED
  // =========================
  deleteSelected(): void {

    if (
      this.selectedExamIds.size
      === 0
    ) {

      alert(
        'Vui lòng chọn đề thi'
      );

      return;
    }

    if (
      !confirm(
        'Xoá các đề đã chọn?'
      )
    ) {
      return;
    }

    const ids =
      Array.from(
        this.selectedExamIds
      );

    this.examService
      .deleteManyExams(ids)
      .subscribe({

        next: () => {

          this.exams =
            this.exams.filter(
              exam =>
                !this.selectedExamIds.has(
                  exam.exam_id
                )
            );

          this.selectedExamIds.clear();

          this.selectAll = false;

          this.applyFilter();
        },

        error: (err) => {

          console.error(
            'Delete selected failed',
            err
          );

          alert(
            'Xóa danh sách thất bại'
          );
        }
      });
  }

  // =========================
  // DELETE ALL
  // =========================
  deleteAll(): void {

    if (
      !confirm(
        'Xoá toàn bộ đề thi?'
      )
    ) {
      return;
    }

    this.examService
      .deleteAllExams()
      .subscribe({

        next: () => {

          this.exams = [];

          this.selectedExamIds.clear();

          this.selectAll = false;

          this.applyFilter();
        },

        error: (err) => {

          console.error(
            'Delete all failed',
            err
          );

          alert(
            'Xóa toàn bộ thất bại'
          );
        }
      });
  }

  // =========================
  // EMPTY
  // =========================
  get isEmpty(): boolean {

    return (
      this.filteredExams.length
      === 0
    );
  }

  // =========================
  // LABELS
  // =========================
  getSubjectLabel(
    exam: any
  ): string {

    return (
      exam?.subject
        ?.subject_name
      || 'Chưa phân loại'
    );
  }

  getTopicLabel(
    exam: any
  ): string {

    return (
      exam?.topic
        ?.topic_name
      || 'Không có'
    );
  }

  // =========================
  // STATUS
  // =========================
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
  // RANDOM LABEL
  // =========================
  getRandomLabel(
    exam: any
  ): string {

    if (!exam?.is_random) {

      return 'Đề cố định';
    }

    return `Random ${exam.random_question_count} câu`;
  }

  // =========================
  // SHUFFLE LABEL
  // =========================
  getShuffleLabel(
    exam: any
  ): string {

    const labels = [];

    if (
      exam?.shuffle_questions
    ) {

      labels.push(
        'Đảo câu'
      );
    }

    if (
      exam?.shuffle_answers
    ) {

      labels.push(
        'Đảo đáp án'
      );
    }

    return labels.length
      ? labels.join(', ')
      : 'Không đảo';
  }

  // =========================
  // QUESTION COUNT
  // =========================
  getQuestionCount(
    exam: any
  ): number {

    return (
      exam?._count
        ?.exam_questions
      ||
      exam?.exam_questions
        ?.length
      ||
      0
    );
  }

  // =========================
  // INTEGRATION
  // =========================
  getIntegrationLabel(
    exam: any
  ): string {

    return exam
      ?.allow_system_integration
      ? 'Đã tích hợp'
      : 'Chưa tích hợp';
  }

  // =========================
  // WARNING
  // =========================
  showIntegrationWarning(): void {

    alert(
      'Khi tích hợp vào hệ thống, đề thi sẽ hiển thị cho tất cả người dùng.'
    );
  }
}