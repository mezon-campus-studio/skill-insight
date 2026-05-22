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

import * as XLSX from 'xlsx';

import Papa from 'papaparse';

import {
  SubjectService
} from '../../../../services/subject.service';

import {
  TopicService
} from '../../../../services/topic.service';

import {
  QuestionBatchService
} from '../../../../services/question-batch.service';

import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-batch-create',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NgSelectModule
  ],

  templateUrl: './batch-create.html',

  styleUrls: ['./batch-create.css']
})

export class BatchCreate
implements OnInit {

  // =========================
  // STATE
  // =========================

  submitting = false;

  isImported = false;

  // =========================
  // DATA
  // =========================

  subjects: any[] = [];

  topics: any[] = [];

  filteredTopics: any[] = [];

  importedRows: any[] = [];

  questions: any[] = [];

  // =========================
  // FORM
  // =========================

  questionCount = 1;

  manualSubject = '';

  manualTopic = '';

  currentUser: any = null;

  formData = {

    batch_name: '',

    description: '',

    subject_id: null,

    topic_id: null,

    visibility: 'PRIVATE',

    contribute_system: false
    
  };

  constructor(

    private subjectService:
      SubjectService,

    private topicService:
      TopicService,

    private batchService:
      QuestionBatchService,

    private authService:
      AuthService,

    private router: Router

  ) {}

  // =========================
  // INIT
  // =========================

  ngOnInit(): void {

    this.currentUser =
    this.authService.getCurrentUser();

    this.loadSubjects();

    this.loadTopics();

  }

  // =========================
  // LOAD SUBJECTS
  // =========================

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

  // =========================
  // LOAD TOPICS
  // =========================

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
  // SUBJECT CHANGE
  // =========================

  onSubjectChange(): void {

    this.formData.topic_id = null;

    if (!this.formData.subject_id) {

      this.filteredTopics =
        [...this.topics];

      return;

    }

    this.filteredTopics =

      this.topics.filter(

        (topic: any) =>

          Number(topic.subject_id) ===

          Number(this.formData.subject_id)

      );

  }

  // =========================
  // RESET IMPORT MODE
  // =========================

  resetImportMode(): void {

    this.isImported = false;

    this.importedRows = [];

    this.manualSubject = '';

    this.manualTopic = '';

  }

  // =========================
  // IMPORT FILE
  // =========================

  onFileSelected(event: any): void {

    const file =
      event.target.files?.[0];

    if (!file) {

      return;

    }

    const fileName =
      file.name.toLowerCase();

    // =========================
    // CSV
    // =========================

    if (
      fileName.endsWith('.csv')
    ) {

      Papa.parse(file, {

        header: true,

        skipEmptyLines: true,

        complete: (
          result: any
        ) => {

          this.handleImportedData(
            result.data
          );

        },

        error: (err: any) => {

          console.error(err);

          alert(
            'Không thể đọc file CSV'
          );

        }

      });

      return;

    }

    // =========================
    // EXCEL
    // =========================

    const reader =
      new FileReader();

    reader.onload = (
      e: any
    ) => {

      const data =
        new Uint8Array(
          e.target.result
        );

      const workbook =
        XLSX.read(data, {
          type: 'array'
        });

      const sheetName =
        workbook.SheetNames[0];

      const worksheet =
        workbook.Sheets[sheetName];

      const jsonData =
        XLSX.utils.sheet_to_json(
          worksheet
        );

      this.handleImportedData(
        jsonData as any[]
      );

    };

    reader.readAsArrayBuffer(file);

  }

  // =========================
  // HANDLE IMPORT
  // =========================

  handleImportedData(
    rows: any[]
  ): void {

    if (!rows.length) {

      alert(
        'File không có dữ liệu'
      );

      return;

    }

    // RESET
    this.questions = [];

    this.importedRows = rows;

    // IMPORT MODE
    this.isImported = true;

    // RESET SELECT
    this.formData.subject_id = null;

    this.formData.topic_id = null;

    // =========================
    // LOOP QUESTIONS
    // =========================

    rows.forEach((row: any) => {

      let correctAnswer = 'A';

      switch (
        Number(row.correct_index)
      ) {

        case 1:
          correctAnswer = 'A';
          break;

        case 2:
          correctAnswer = 'B';
          break;

        case 3:
          correctAnswer = 'C';
          break;

        case 4:
          correctAnswer = 'D';
          break;

      }

      const difficulty =
        String(
          row.difficulty || 'EASY'
        ).toUpperCase();

      this.questions.push({

        question_text:
          row.question_text || '',

        option_a:
          row.answer_1 || '',

        option_b:
          row.answer_2 || '',

        option_c:
          row.answer_3 || '',

        option_d:
          row.answer_4 || '',

        correct_answer:
          correctAnswer,

        difficulty:
          ['EASY', 'MEDIUM', 'HARD']
          .includes(difficulty)
            ? difficulty
            : 'EASY',

        explanation:
          row.explanation || ''

      });

    });

    // =========================
    // AUTO FILL
    // =========================

    const first =
      rows[0];

    this.manualSubject =
      first.subject_name || '';

    this.manualTopic =
      first.topic_name || '';

    this.formData.batch_name =
      first.batch_name ||
      'Imported Batch';

    this.formData.description =
      'Imported from file';

    console.log(
      'IMPORT SUCCESS:',
      {
        isImported:
          this.isImported,

        manualSubject:
          this.manualSubject,

        manualTopic:
          this.manualTopic,

        totalQuestions:
          this.questions.length
      }
    );

    alert(
      `Import thành công ${rows.length} câu hỏi`
    );

  }

  // =========================
  // ADD QUESTION
  // =========================

  addQuestion(): void {

    // THOÁT IMPORT MODE
    if (this.isImported) {

      this.resetImportMode();

    }

    this.questions.push({

      question_text: '',

      option_a: '',

      option_b: '',

      option_c: '',

      option_d: '',

      correct_answer: 'A',

      difficulty: 'EASY',

      explanation: ''

    });

  }

  // =========================
  // ADD MULTIPLE
  // =========================

  addMultipleQuestions(): void {

    const count =
      Number(this.questionCount);

    if (
      !count ||
      count <= 0
    ) {

      alert(
        'Số lượng không hợp lệ'
      );

      return;

    }

    for (
      let i = 0;
      i < count;
      i++
    ) {

      this.addQuestion();

    }

    this.questionCount = 1;

  }

  // =========================
  // REMOVE QUESTION
  // =========================

  removeQuestion(
    index: number
  ): void {

    const confirmDelete =
      confirm(
        'Bạn có chắc muốn xoá câu hỏi này?'
      );

    if (!confirmDelete) {

      return;

    }

    this.questions.splice(
      index,
      1
    );

  }

  // =========================
  // DOWNLOAD TEMPLATE
  // =========================

  downloadTemplate(): void {

    const template = [

      {

        subject_name:
          'Java',

        topic_name:
          'OOP',

        batch_name:
          'Đề Java OOP cơ bản',

        question_text:
          'Java là gì?',

        difficulty:
          'easy',

        answer_1:
          'Ngôn ngữ lập trình',

        answer_2:
          'Hệ điều hành',

        answer_3:
          'Database',

        answer_4:
          'IDE',

        correct_index:
          1,

        explanation:
          'Java là ngôn ngữ lập trình.'

      }

    ];

    const worksheet =
      XLSX.utils.json_to_sheet(
        template
      );

    const workbook =
      XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(

      workbook,

      worksheet,

      'Template'

    );

    XLSX.writeFile(

      workbook,

      'question-template.xlsx'

    );

  }

  // =========================
  // VALIDATE
  // =========================

  validateForm(): boolean {

    // CHECK QUESTIONS
    if (this.questions.length === 0) {

      alert('Vui lòng thêm câu hỏi');

      return false;

    }

    // IMPORT MODE
    if (this.isImported) {

      return true;

    }

    // MANUAL MODE
    const hasSubject =
      this.formData.subject_id;

    const hasTopic =
      this.formData.topic_id;

    if (
      !this.formData.batch_name ||
      !hasSubject ||
      !hasTopic
    ) {

      alert(
        'Vui lòng nhập đầy đủ thông tin bộ câu hỏi'
      );

      return false;

    }

    return true;

  }

  // =========================
  // SUBMIT
  // =========================

  submitAll(): void {

    console.log(
      'MODE:',
      this.isImported
        ? 'IMPORT'
        : 'MANUAL'
    );

    // VALIDATE
    if (!this.validateForm()) {

      return;

    }

    // =========================
    // IMPORT MODE
    // =========================

    if (this.isImported) {

      if (!this.manualSubject?.trim()) {

        alert('Thiếu tên môn học');

        return;

      }

      if (!this.manualTopic?.trim()) {

        alert('Thiếu tên chủ đề');

        return;

      }

      const payload = {

        batch_name:
          this.formData.batch_name?.trim()
          || 'Imported Batch',

        description:
          this.formData.description?.trim()
          || 'Imported from file',

        subject_name:
          this.manualSubject.trim(),

        topic_name:
          this.manualTopic.trim(),

        visibility:
          this.formData.contribute_system
            ? 'SYSTEM_BANK'
            : 'PRIVATE',

        imported: true,

        questions:
          this.questions.map((q: any) => ({

            question_text:
              q.question_text || '',

            option_a:
              q.option_a || '',

            option_b:
              q.option_b || '',

            option_c:
              q.option_c || '',

            option_d:
              q.option_d || '',

            correct_answer:
              q.correct_answer || 'A',

            difficulty:
              String(
                q.difficulty || 'EASY'
              ).toUpperCase(),

            explanation:
              q.explanation || ''

          }))

      };

      console.log(
        'IMPORT PAYLOAD:',
        payload
      );

      this.submitting = true;

      this.batchService
        .createQuestionBatch(payload)
        .subscribe({

          next: (res: any) => {

            console.log(
              'IMPORT SUCCESS:',
              res
            );

            this.submitting = false;

            alert(
              'Import bộ câu hỏi thành công'
            );

            this.router.navigate([
              '/dashboard/question-batches'
            ]);

          },

          error: (err: any) => {

            console.error(
              'IMPORT ERROR:',
              err
            );

            console.error(
              'ERROR BODY:',
              err?.error
            );

            this.submitting = false;

            alert(

              err?.error?.message ||

              JSON.stringify(
                err?.error
              ) ||

              'Có lỗi xảy ra'

            );

          }

        });

      return;

    }

    // =========================
    // MANUAL MODE
    // =========================

    const payload = {

      batch_name:
        this.formData.batch_name,

      description:
        this.formData.description,

      subject_id:
        Number(
          this.formData.subject_id
        ),

      topic_id:
        Number(
          this.formData.topic_id
        ),

      visibility:
        this.formData.contribute_system
          ? 'SYSTEM_BANK'
          : 'PRIVATE',

      questions:
        this.questions

    };

    console.log(
      'MANUAL PAYLOAD:',
      payload
    );

    this.submitting = true;

    this.batchService
      .createQuestionBatch(payload)
      .subscribe({

        next: (res: any) => {

          console.log(
            'CREATE SUCCESS:',
            res
          );

          this.submitting = false;

          alert(
            'Tạo bộ câu hỏi thành công'
          );

          this.router.navigate([
            '/dashboard/question-batches'
          ]);

        },

        error: (err: any) => {

          console.error(
            'CREATE ERROR:',
            err
          );

          this.submitting = false;

          alert(

            err?.error?.message ||

            JSON.stringify(
              err?.error
            ) ||

            'Có lỗi xảy ra'

          );

        }

      });

  }

}