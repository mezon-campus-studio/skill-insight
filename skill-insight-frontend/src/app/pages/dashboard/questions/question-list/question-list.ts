
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
  QuestionService
} from '../../../../services/question.service';

import {
  SubjectService
} from '../../../../services/subject.service';

import {
  TopicService
} from '../../../../services/topic.service';

@Component({
  selector: 'app-question-list',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgSelectModule
  ],

  templateUrl: './question-list.html',

  styleUrls: ['./question-list.css']
})

export class QuestionList
implements OnInit {

  questions: any[] = [];

  filteredQuestions: any[] = [];

  paginatedQuestions: any[] = [];

  subjects: any[] = [];

  topics: any[] = [];

  filteredTopics: any[] = [];

  loading = false;

  deletingId: number | null = null;

  searchKeyword = '';

  selectedSubject: number | null = null;

  selectedTopic: number | null = null;

  selectedDifficulty: string | null = null;

  currentPage = 1;

  itemsPerPage = 5;

  totalPages = 1;

  pages: number[] = [];

  currentUserRole = '';

  currentUserId: number | null = null;

  currentTab:
    'SYSTEM_BANK'
    | 'PRIVATE'
    = 'SYSTEM_BANK';

  difficultyOptions = [

    {
      label: 'Dễ',
      value: 'easy'
    },

    {
      label: 'Trung bình',
      value: 'medium'
    },

    {
      label: 'Khó',
      value: 'hard'
    }

  ];

  constructor(

    private questionService:
      QuestionService,

    private subjectService:
      SubjectService,

    private topicService:
      TopicService,

    private router: Router

  ) {}

  ngOnInit(): void {

    const user =
      JSON.parse(
        localStorage.getItem('user') || '{}'
      );

    this.currentUserId =
      user.userId ||
      user.user_id ||
      null;

    this.currentUserRole =
      (user.role || '').toLowerCase();

    this.loadSubjects();

    this.loadTopics();

    this.loadQuestions();

  }

  // =========================
  // TAB
  // =========================

  setTab(
    tab: 'SYSTEM_BANK' | 'PRIVATE'
  ): void {

    this.currentTab = tab;

    this.loadQuestions();

  }

  // =========================
  // LOAD DATA
  // =========================

  loadQuestions(): void {

    this.loading = true;

    this.questionService
      .getQuestions()
      .subscribe({

        next: (res: any) => {

          console.log(
            'QUESTIONS API RAW:',
            res
          );

          this.questions =
            res?.data?.data ||
            res?.data ||
            res?.questions ||
            [];

          this.filterQuestions();

          this.loading = false;

        },

        error: (err) => {

          console.error(err);

          this.questions = [];

          this.loading = false;

        }

      });

  }

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

  // =========================
  // FILTER
  // =========================

  onSubjectChange(): void {

    if (!this.selectedSubject) {

      this.filteredTopics =
        [...this.topics];

    } else {

      this.filteredTopics =
        this.topics.filter(

          (topic) =>

            Number(topic.subject_id)
            ===
            Number(this.selectedSubject)

        );

    }

    this.filterQuestions();

  }

  filterQuestions(): void {

    let data = [...this.questions];

    // =========================
    // TAB
    // =========================

    if (
      this.currentTab === 'SYSTEM_BANK'
    ) {

      data = data.filter(

        (question) =>

          (
            question.visibility ||
            'PRIVATE'
          )

          ===

          'SYSTEM_BANK'

      );

    }

    if (
      this.currentTab === 'PRIVATE'
    ) {

      data = data.filter(

        (question) =>

          (
            question.visibility ||
            'PRIVATE'
          )

          ===

          'PRIVATE'

          &&

          Number(
            question.created_by ||
            question.teacher_id
          )

          ===

          Number(
            this.currentUserId
          )

      );

    }

    // =========================
    // SEARCH
    // =========================

    if (this.searchKeyword) {

      data = data.filter(

        (question) =>

          question.content
            ?.toLowerCase()
            .includes(
              this.searchKeyword
                .toLowerCase()
            )

      );

    }

    // =========================
    // SUBJECT
    // =========================

    if (this.selectedSubject) {

      data = data.filter(

        (question) =>

          Number(question.subject_id)

          ===

          Number(this.selectedSubject)

      );

    }

    // =========================
    // TOPIC
    // =========================

    if (this.selectedTopic) {

      data = data.filter(

        (question) =>

          Number(question.topic_id)

          ===

          Number(this.selectedTopic)

      );

    }

    // =========================
    // LEVEL
    // =========================

    if (this.selectedDifficulty) {

      data = data.filter(

        (question) =>

          String(question.level)
            .toUpperCase()

          ===

          this.selectedDifficulty
  ?.toUpperCase()

      );

    }

    this.filteredQuestions = data;

    this.currentPage = 1;

    this.updatePagination();

  }

  // =========================
  // PAGINATION
  // =========================

  updatePagination(): void {

    this.totalPages =
      Math.ceil(
        this.filteredQuestions.length /
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
      (this.currentPage - 1)
      * this.itemsPerPage;

    const end =
      start + this.itemsPerPage;

    this.paginatedQuestions =
      this.filteredQuestions.slice(
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

  // =========================
  // HELPERS
  // =========================

  getSubjectName(
    subjectId: number
  ): string {

    const subject =
      this.subjects.find(

        (s) =>

          s.subject_id === subjectId

      );

    return (
      subject?.subject_name
      || 'Unknown'
    );

  }

  getTopicName(
    topicId: number
  ): string {

    const topic =
      this.topics.find(

        (t) =>

          t.topic_id === topicId

      );

    return (
      topic?.topic_name
      || 'Unknown'
    );

  }

  canEdit(question: any): boolean {

    return (

      question.visibility ===
      'PRIVATE'

      &&

      Number(
        question.created_by ||
        question.teacher_id
      )

      ===

      Number(this.currentUserId)

    );

  }

  canDelete(question: any): boolean {

    return this.canEdit(question);

  }

  canClone(question: any): boolean {

    return (
      question.visibility ===
      'SYSTEM_BANK'
    );

  }

  // =========================
  // NAVIGATION
  // =========================

  
  createBatch(): void {

    this.router.navigate([
      '/dashboard/question-batches/create'
    ]);

  }

  goToBatchList(): void {

    this.router.navigate([
      '/dashboard/question-batches'
    ]);

  }


  viewDetail(id: number): void {

    this.router.navigate([
      '/dashboard/questions',
      id
    ]);

  }

  editQuestion(id: number): void {

    this.router.navigate([
      '/dashboard/questions/edit',
      id
    ]);

  }

  // =========================
  // DELETE
  // =========================

  deleteQuestion(id: number): void {

    const confirmDelete =
      confirm(
        'Bạn có chắc muốn xoá câu hỏi này?'
      );

    if (!confirmDelete) {

      return;

    }

    this.deletingId = id;

    this.questionService
      .deleteQuestion(id)
      .subscribe({

        next: () => {

          this.questions =
            this.questions.filter(

              (q) =>

                q.question_id !== id

            );

          this.filterQuestions();

          this.deletingId = null;

          alert(
            'Xoá câu hỏi thành công'
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

  integrateQuestion(
    id: number
  ): void {

    const confirmed =
      confirm(

        'Khi tích hợp vào hệ thống, giáo viên khác có thể xem và sử dụng câu hỏi này. Bạn có chắc muốn tiếp tục?'

      );

    if (!confirmed) {

      return;

    }

    this.questionService
      .integrateQuestion(id)
      .subscribe({

        next: () => {

          alert(
            'Đã tích hợp vào hệ thống'
          );

          this.loadQuestions();

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

  // =========================
  // CLONE
  // =========================

  cloneQuestion(
    question: any
  ): void {

    const payload = {

      subject_id:
        question.subject_id,

      topic_id:
        question.topic_id,

      content:
        question.content,

      level:
        String(
          question.level
        ).toLowerCase(),

      explanation:
        question.explanation,

      visibility:
        'PRIVATE',

      answers:
        question.answers.map(
          (a: any) => ({

            content:
              a.answer_text,

            is_correct:
              a.is_correct

          })
        )

    };

    this.questionService
      .createQuestion(payload)
      .subscribe({

        next: () => {

          alert(
            'Clone câu hỏi thành công'
          );

          this.loadQuestions();

        },

        error: (err) => {

          console.error(err);

          alert(
            err?.error?.message
            || 'Clone thất bại'
          );

        }

      });

  }

  // =========================
  // TRACK BY
  // =========================

  trackByQuestionId(
    index: number,
    item: any
  ): number {

    return item.question_id;

  }

}

