import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import {
  Router,
  RouterModule
} from '@angular/router';

import {
  ExamService
} from '../../../../services/exam.service';

@Component({
  selector: 'app-create-exam',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],

  templateUrl: './create-exam.html',

  styleUrl: './create-exam.css',
})
export class CreateExam implements OnInit {

  // =========================
  // FORM
  // =========================
  examData = {

    // BASIC
    title: '',

    description: '',

    subject_id: '',

    topic_id: '',

    teacher_id: 1,

    // EXAM
    duration: 60,

    pass_score: 5,

    visibility: 'PRIVATE',

    status_exam: 'DRAFT',

    // RANDOM
    is_random: false,

    random_question_count: 0,

    shuffle_questions: true,

    shuffle_answers: true,

    // SYSTEM
    allow_system_integration: false
  };

  // =========================
  // QUICK CREATE
  // =========================
  newSubjectName = '';

  newTopicName = '';

  // =========================
  // DATA
  // =========================
  subjects: any[] = [];

  topics: any[] = [];

  // =========================
  // IMPORT FILE
  // =========================
  selectedQuestionFile:
    File | null = null;

  // =========================
  // UI
  // =========================
  loading = false;

  // =========================
  // CONSTRUCTOR
  // =========================
  constructor(

    private examService:
      ExamService,

    private router:
      Router

  ) {}

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {

    this.loadSubjects();
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
            res?.data || res || [];
        },

        error: (err: any) => {

          console.error(
            'Load subjects failed',
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

    this.examService
      .getTopics(
        Number(
          this.examData.subject_id
        )
      )
      .subscribe({

        next: (res: any) => {

          this.topics =
            res?.data || res || [];
        },

        error: (err: any) => {

          console.error(
            'Load topics failed',
            err
          );
        }
      });
  }

  // =========================
  // QUICK CREATE SUBJECT
  // =========================
  createSubjectByEnter(): void {

    const name =
      this.newSubjectName.trim();

    if (!name) {
      return;
    }

    const payload = {

      subject_name: name,

      created_by: 1
    };

    this.examService
      .createSubject(payload)
      .subscribe({

        next: (res: any) => {

          const subject =
            res?.data || res;

          this.subjects.unshift(
            subject
          );

          this.examData.subject_id =
            String(
              subject.subject_id
            );

          this.newSubjectName = '';

          this.onSubjectChange();

          alert(
            'Đã tạo môn học'
          );
        },

        error: (err: any) => {

          console.error(err);

          alert(
            err?.error?.message ||
            'Tạo môn học thất bại'
          );
        }
      });
  }

  // =========================
  // QUICK CREATE TOPIC
  // =========================
  createTopicByEnter(): void {

    if (
      !this.examData.subject_id
    ) {

      alert(
        'Vui lòng chọn môn học trước'
      );

      return;
    }

    const name =
      this.newTopicName.trim();

    if (!name) {
      return;
    }

    const payload = {

      topic_name: name,

      subject_id: Number(
        this.examData.subject_id
      ),

      creator_id: 1
    };

    this.examService
      .createTopic(payload)
      .subscribe({

        next: (res: any) => {

          const topic =
            res?.data || res;

          this.topics.unshift(
            topic
          );

          this.examData.topic_id =
            String(
              topic.topic_id
            );

          this.newTopicName = '';

          alert(
            'Đã tạo chủ đề'
          );
        },

        error: (err: any) => {

          console.error(err);

          alert(
            err?.error?.message ||
            'Tạo chủ đề thất bại'
          );
        }
      });
  }

  // =========================
  // TOGGLE RANDOM
  // =========================
  onToggleRandom(): void {

    if (
      !this.examData.is_random
    ) {

      this.examData
        .random_question_count = 0;

      this.examData
        .shuffle_questions = false;
    } else {

      this.examData
        .shuffle_questions = true;
    }
  }

  // =========================
  // FILE CHANGE
  // =========================
  onQuestionFileChange(
    event: any
  ): void {

    const file =
      event?.target?.files?.[0];

    if (!file) {
      return;
    }

    this.selectedQuestionFile =
      file;

    console.log(
      'Selected file:',
      file.name
    );
  }

  // =========================
  // REMOVE FILE
  // =========================
  removeSelectedFile(): void {

    this.selectedQuestionFile =
      null;
  }

  // =========================
  // VALIDATE
  // =========================
  validateForm(): boolean {

    if (
      !this.examData
        .title
        .trim()
    ) {

      alert(
        'Vui lòng nhập tên đề thi'
      );

      return false;
    }

    if (
      !this.examData
        .subject_id
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
        !this.examData
          .random_question_count
        ||
        Number(
          this.examData
            .random_question_count
        ) <= 0
      ) {

        alert(
          'Nhập số câu random'
        );

        return false;
      }
    }

    return true;
  }

  // =========================
  // CREATE EXAM
  // =========================
  createExam(): void {

    if (
      !this.validateForm()
    ) {
      return;
    }

    this.loading = true;

    // =========================
    // FORM DATA
    // =========================
    const formData =
      new FormData();

    // BASIC
    formData.append(
      'title',
      this.examData
        .title
        .trim()
    );

    formData.append(
      'description',
      this.examData
        .description || ''
    );

    formData.append(
      'subject_id',
      String(
        this.examData
          .subject_id
      )
    );

    if (
      this.examData.topic_id
    ) {

      formData.append(
        'topic_id',
        String(
          this.examData
            .topic_id
        )
      );
    }

    formData.append(
      'teacher_id',
      String(
        this.examData
          .teacher_id
      )
    );

    // EXAM
    formData.append(
      'duration',
      String(
        this.examData
          .duration
      )
    );

    formData.append(
      'pass_score',
      String(
        this.examData
          .pass_score
      )
    );

    formData.append(
      'visibility',
      this.examData
        .visibility
    );

    formData.append(
      'status_exam',
      this.examData
        .status_exam
    );

    // RANDOM
    formData.append(
      'is_random',
      String(
        this.examData
          .is_random
      )
    );

    formData.append(
      'random_question_count',
      this.examData
        .is_random
        ? String(
            this.examData
              .random_question_count
          )
        : '0'
    );

    formData.append(
      'shuffle_questions',
      String(
        this.examData
          .shuffle_questions
      )
    );

    formData.append(
      'shuffle_answers',
      String(
        this.examData
          .shuffle_answers
      )
    );

    // SYSTEM
    formData.append(
      'allow_system_integration',
      String(
        this.examData
          .allow_system_integration
      )
    );

    // =========================
    // IMPORT QUESTION FILE
    // =========================
    if (
      this.selectedQuestionFile
    ) {

      formData.append(
        'question_file',
        this
          .selectedQuestionFile
      );
    }

    console.log(
      'CREATE EXAM FORM DATA'
    );

    // =========================
    // API
    // =========================
    this.examService
      .createExam(formData)
      .subscribe({

        next: (res: any) => {

          this.loading = false;

          console.log(
            'CREATE EXAM SUCCESS:',
            res
          );

          alert(
            'Tạo đề thi thành công'
          );

          this.router.navigate([
            '/dashboard/exams'
          ]);
        },

        error: (err: any) => {

          this.loading = false;

          console.error(
            'CREATE EXAM ERROR:',
            err
          );

          alert(
            err?.error?.message
            || 'Tạo đề thi thất bại'
          );
        }
      });
  }
}