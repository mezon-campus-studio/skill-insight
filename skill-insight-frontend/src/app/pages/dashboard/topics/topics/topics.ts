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
  firstValueFrom
} from 'rxjs';

import {
  TopicService
} from '../../../../services/topic.service';

import {
  SubjectService
} from '../../../../services/subject.service';

import {
  Topic
} from '../../../../shared/interfaces/topic.interface';

@Component({
  selector: 'app-topics',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],

  templateUrl: './topics.html',

  styleUrls: ['./topics.css']
})

export class Topics
implements OnInit {

  // =========================================
  // GLOBAL
  // =========================================

  Math = Math;

  loading = false;

  deletingId:
    number | null = null;

  // =========================================
  // DATA
  // =========================================

  topics: Topic[] = [];

  subjects: any[] = [];

  totalItems = 0;

  // =========================================
  // FILTER
  // =========================================

  searchKeyword = '';

  selectedSubject = '';

  // =========================================
  // PAGINATION
  // =========================================

  currentPage = 1;

  itemsPerPage = 5;

  totalPages = 1;

  // =========================================
  // SELECT
  // =========================================

  selectedTopics: number[] = [];

  isAllSelected = false;

  // =========================================
  // CONSTRUCTOR
  // =========================================

  constructor(

    private topicService:
      TopicService,

    private subjectService:
      SubjectService,

    private router:
      Router

  ) {}

  // =========================================
  // INIT
  // =========================================

  ngOnInit(): void {

    this.loadSubjects();

    this.loadTopics();

  }

  // =========================================
  // LOAD SUBJECTS
  // =========================================

  loadSubjects(): void {

    this.subjectService
      .getAll(1, 9999)
      .subscribe({

        next: (res: any) => {

          this.subjects =
            res?.subjects || [];

        },

        error: (err: any) => {

          console.error(err);

        }

      });

  }

  // =========================================
  // LOAD TOPICS
  // =========================================

  loadTopics(): void {

    this.loading = true;

    this.topicService
      .getTopics(
        this.currentPage,
        this.itemsPerPage,
        this.searchKeyword,
        this.selectedSubject
      )
      .subscribe({

        next: (res: any) => {

          console.log(
            'TOPICS RESPONSE:',
            res
          );

          this.topics =
            res?.topics || [];

          this.totalItems =
            res?.pagination
              ?.totalItems || 0;

          this.totalPages =
            res?.pagination
              ?.totalPages || 1;

          // FIX PAGE OVERFLOW
          if (
            this.currentPage >
            this.totalPages
          ) {

            this.currentPage =
              this.totalPages;

          }

          this.updateSelectAllState();

          this.loading = false;

        },

        error: (err: any) => {

          console.error(err);

          this.loading = false;

        }

      });

  }

  // =========================================
  // FILTER
  // =========================================

  filterTopics(): void {

    this.currentPage = 1;

    this.loadTopics();

  }

  // =========================================
  // PAGINATION
  // =========================================

  goToPage(
    page: number
  ): void {

    if (
      page < 1 ||
      page > this.totalPages
    ) return;

    this.currentPage = page;

    this.loadTopics();

  }

  nextPage(): void {

    if (
      this.currentPage <
      this.totalPages
    ) {

      this.currentPage++;

      this.loadTopics();

    }

  }

  previousPage(): void {

    if (
      this.currentPage > 1
    ) {

      this.currentPage--;

      this.loadTopics();

    }

  }

  getPageNumbers(): number[] {

    return Array.from(

      {
        length:
          this.totalPages
      },

      (_, i) => i + 1

    );

  }

  // =========================================
  // SELECT
  // =========================================

  toggleTopic(
    topicId: number
  ): void {

    topicId = Number(topicId);

    const exists =
      this.selectedTopics.includes(
        topicId
      );

    if (exists) {

      this.selectedTopics =
        this.selectedTopics.filter(
          id => id !== topicId
        );

    } else {

      this.selectedTopics.push(
        topicId
      );

    }

    this.updateSelectAllState();

  }

  isChecked(
    topicId: number
  ): boolean {

    return this.selectedTopics.includes(
      Number(topicId)
    );

  }

  toggleSelectAll(
    event: any
  ): void {

    const checked =
      event.target.checked;

    this.isAllSelected =
      checked;

    const currentPageIds =
      this.topics.map(

        topic =>

          Number(
            topic.topic_id
          )

      );

    if (checked) {

      this.selectedTopics = [

        ...new Set([

          ...this.selectedTopics,

          ...currentPageIds

        ])

      ];

    } else {

      this.selectedTopics =
        this.selectedTopics.filter(

          id =>

            !currentPageIds.includes(id)

        );

    }

  }

  updateSelectAllState(): void {

    this.isAllSelected =

      this.topics.length > 0 &&

      this.topics.every(

        topic =>

          this.selectedTopics.includes(
            Number(topic.topic_id)
          )

      );

  }

  // =========================================
  // SUBJECT NAME
  // =========================================

  getSubjectName(
    subjectId: number
  ): string {

    const subject =
      this.subjects.find(

        (s) =>

          Number(
            s.subject_id
          ) ===
          Number(subjectId)

      );

    return (
      subject?.subject_name ||
      '---'
    );

  }

  // =========================================
  // EDIT
  // =========================================

  editTopic(
    id: number
  ): void {

    this.router.navigate([

      '/dashboard/topics/edit',
      id

    ]);

  }

  // =========================================
  // DELETE ONE
  // =========================================

  deleteTopic(
    id: number
  ): void {

    const confirmed = confirm(
      'Bạn có chắc muốn xóa topic này?'
    );

    if (!confirmed) return;

    this.deletingId = id;

    this.topicService
      .deleteTopic(id)
      .subscribe({

        next: () => {

          this.selectedTopics =
            this.selectedTopics.filter(
              topicId =>
                topicId !== Number(id)
            );

          // FIX PAGE AFTER DELETE
          if (
            this.topics.length === 1 &&
            this.currentPage > 1
          ) {

            this.currentPage--;

          }

          this.loadTopics();

          this.deletingId =
            null;

        },

        error: (err: any) => {

          console.error(err);

          this.deletingId =
            null;

          alert(
            err?.error?.message ||
            'Xóa thất bại'
          );

        }

      });

  }

  // =========================================
  // DELETE SELECTED
  // =========================================

  async deleteSelectedTopics(): Promise<void> {

    if (
      this.selectedTopics.length === 0
    ) {

      alert(
        'Vui lòng chọn topic'
      );

      return;

    }

    const confirmed = confirm(

      `Xóa ${this.selectedTopics.length} topic đã chọn?`

    );

    if (!confirmed) return;

    this.loading = true;

    try {

      for (
        const topicId of
        this.selectedTopics
      ) {

        try {

          await firstValueFrom(

            this.topicService
              .deleteTopic(topicId)

          );

        } catch (err) {

          console.error(err);

        }

      }

      this.selectedTopics = [];

      this.loadTopics();

      this.loading = false;

      alert(
        'Đã xóa các topic được chọn'
      );

    } catch (err) {

      console.error(err);

      this.loading = false;

    }

  }

  // =========================================
  // DELETE ALL
  // =========================================

  async deleteAllTopics(): Promise<void> {

    if (
      this.totalItems === 0
    ) {

      alert(
        'Không có topic nào'
      );

      return;

    }

    const confirmed = confirm(

      'Bạn có chắc muốn xóa TOÀN BỘ topic?'

    );

    if (!confirmed) return;

    this.loading = true;

    try {

      const allData: any =
        await firstValueFrom(

          this.topicService
            .getTopics(
              1,
              999999
            )

        );

      const allTopics =
        allData?.topics || [];

      for (
        const topic of
        allTopics
      ) {

        try {

          await firstValueFrom(

            this.topicService
              .deleteTopic(
                Number(
                  topic.topic_id
                )
              )

          );

        } catch (err) {

          console.error(err);

        }

      }

      this.selectedTopics = [];

      this.currentPage = 1;

      this.loadTopics();

      this.loading = false;

      alert(
        'Đã xóa toàn bộ topic'
      );

    } catch (err) {

      console.error(err);

      this.loading = false;

    }

  }

  // =========================================
  // TRACK BY
  // =========================================

  trackByTopicId(

    index: number,

    topic: Topic

  ): number {

    return Number(
      topic.topic_id
    );

  }

}