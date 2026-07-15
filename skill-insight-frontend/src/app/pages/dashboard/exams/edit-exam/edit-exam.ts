import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import {
  ActivatedRoute,
  Router,
  RouterModule
} from '@angular/router';

import {
  ExamService
} from '../../../../services/exam.service';

@Component({
  selector: 'app-edit-exam',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],

  templateUrl: './edit-exam.html',

  styleUrl: './edit-exam.css',
})
export class EditExam implements OnInit {

  // =========================
  // ID
  // =========================
  examId = 0;

  // =========================
  // UI
  // =========================
  loading = false;

  saving = false;

  // =========================
  // DATA
  // =========================
  subjects: any[] = [];

  topics: any[] = [];

  // =========================
  // FORM
  // =========================
  examData = {

    title: '',

    description: '',

    subject_id: '',

    topic_id: '',

    duration: 60,

    pass_score: 5,

    visibility: 'PRIVATE',

    status_exam: 'DRAFT',

    is_random: false,

    random_question_count: 0,

    shuffle_questions: true,

    shuffle_answers: true,

    allow_system_integration: false
  };

  // =========================
  // CONSTRUCTOR
  // =========================
  constructor(

    private route: ActivatedRoute,

    private router: Router,

    private examService: ExamService

  ) {}

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {

    this.examId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.loadSubjects();

    this.loadExam();
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
  // LOAD EXAM
  // =========================
  loadExam(): void {

    this.loading = true;

    this.examService
      .getExamById(this.examId)
      .subscribe({

        next: (res: any) => {

          const exam =
            res?.data || res;

          console.log(
            'EXAM DETAIL:',
            exam
          );

          this.examData = {

            title:
              exam?.title || '',

            description:
              exam?.description || '',

            subject_id:
              exam?.subject_id
                ? String(
                    exam.subject_id
                  )
                : '',

            topic_id:
              exam?.topic_id
                ? String(
                    exam.topic_id
                  )
                : '',

            duration:
              exam?.duration || 60,

            pass_score:
              exam?.pass_score || 5,

            visibility:
              exam?.visibility
              || 'PRIVATE',

            status_exam:
              exam?.status_exam
              || 'DRAFT',

            is_random:
              exam?.is_random || false,

            random_question_count:
              exam?.random_question_count || 0,

            shuffle_questions:
              exam?.shuffle_questions ?? true,

            shuffle_answers:
              exam?.shuffle_answers ?? true,

            allow_system_integration:
              exam?.allow_system_integration || false
          };

          if (
            this.examData.subject_id
          ) {

            this.loadTopics(
              Number(
                this.examData.subject_id
              )
            );
          }

          this.loading = false;
        },

        error: (err) => {

          this.loading = false;

          console.error(
            'Load exam failed',
            err
          );

          alert(
            'Không thể tải đề thi'
          );
        }
      });
  }

  // =========================
  // LOAD TOPICS
  // =========================
  loadTopics(
    subjectId: number
  ): void {

    this.examService
      .getTopics(subjectId)
      .subscribe({

        next: (res: any) => {

          this.topics =
            res?.data || [];
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
  // SUBJECT CHANGE
  // =========================
  onSubjectChange(): void {

    this.examData.topic_id = '';

    this.topics = [];

    if (
      !this.examData.subject_id
    ) {
      return;
    }

    this.loadTopics(
      Number(
        this.examData.subject_id
      )
    );
  }

  // =========================
  // RANDOM TOGGLE
  // =========================
  onToggleRandom(): void {

    if (
      !this.examData.is_random
    ) {

      this.examData
        .random_question_count = 0;

      this.examData
        .shuffle_questions = false;
    }
  }

  // =========================
  // VALIDATE
  // =========================
  validateForm(): boolean {

    if (
      !this.examData.title.trim()
    ) {

      alert(
        'Vui lòng nhập tên đề thi'
      );

      return false;
    }

    if (
      !this.examData.subject_id
    ) {

      alert(
        'Vui lòng chọn môn học'
      );

      return false;
    }

    if (
      Number(
        this.examData.duration
      ) <= 0
    ) {

      alert(
        'Thời gian thi không hợp lệ'
      );

      return false;
    }

    if (
      this.examData.is_random
    ) {

      if (
        Number(
          this.examData
            .random_question_count
        ) <= 0
      ) {

        alert(
          'Số câu random không hợp lệ'
        );

        return false;
      }
    }

    return true;
  }

  // =========================
  // UPDATE EXAM
  // =========================
  updateExam(): void {

    if (
      !this.validateForm()
    ) {
      return;
    }

    this.saving = true;

    const payload = {

      title:
        this.examData.title.trim(),

      description:
        this.examData.description,

      subject_id:
        Number(
          this.examData.subject_id
        ),

      topic_id:
        this.examData.topic_id
          ? Number(
              this.examData.topic_id
            )
          : null,

      duration:
        Number(
          this.examData.duration
        ),

      pass_score:
        Number(
          this.examData.pass_score
        ),

      visibility:
        this.examData.visibility,

      status_exam:
        this.examData.status_exam,

      is_random:
        this.examData.is_random,

      random_question_count:
        this.examData.is_random
          ? Number(
              this.examData
                .random_question_count
            )
          : 0,

      shuffle_questions:
        this.examData
          .shuffle_questions,

      shuffle_answers:
        this.examData
          .shuffle_answers,

      allow_system_integration:
        this.examData
          .allow_system_integration
    };

    console.log(
      'UPDATE PAYLOAD:',
      payload
    );

    this.examService
      .updateExam(
        this.examId,
        payload
      )
      .subscribe({

        next: () => {

          this.saving = false;

          alert(
            'Cập nhật đề thi thành công'
          );

          this.router.navigate([
            '/dashboard/exams'
          ]);
        },

        error: (err) => {

          this.saving = false;

          console.error(
            'Update exam failed',
            err
          );

          alert(
            err?.error?.message
            || 'Cập nhật đề thi thất bại'
          );
        }
      });
  }
}