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

import { ExamQuestion } from '../../../../models/exam-question.model';
import { AuthService } from '../../../../services/auth.service'; 
import * as XLSX from 'xlsx';

interface QuestionItem {

  question_id: number;

  content: string;

  level: string;

  type: string;

  topic?: any;

  subject?: any;

  selected?: boolean;

}

@Component({

  selector: 'app-create-exam',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],

  templateUrl: './create-exam.html',

  styleUrl: './create-exam.css'

})

export class CreateExam implements OnInit {

  // ==========================================================
  // MODE
  // ==========================================================

  createMode:
    'MANUAL'
    | 'IMPORT'
    | 'QUESTION_BANK'
    = 'MANUAL';

  // ==========================================================
  // FORM
  // ==========================================================

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

  // ==========================================================
  // QUICK CREATE
  // ==========================================================

  newSubjectName = '';

  newTopicName = '';

  addQuestionCount = 1;

  // ==========================================================
  // MASTER DATA
  // ==========================================================

  subjects: any[] = [];

  topics: any[] = [];

  previewQuestions: any[] = [];

  // ==========================================================
  // QUESTION BANK
  // ==========================================================

  myQuestions: QuestionItem[] = [];

  filteredQuestions: QuestionItem[] = [];

  questions: ExamQuestion[] = [];

  selectedQuestionIds =
    new Set<number>();

  keyword = '';

  // ==========================================================
  // IMPORT FILE
  // ==========================================================

  selectedQuestionFile:
    File | null = null;

  // ==========================================================
  // UI
  // ==========================================================

  loading = false;

  loadingQuestions = false;

  isTeacher = false;
  isAdmin = false;

  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(

    private authService: AuthService,

    private examService:
      ExamService,

    private router:
      Router

  ) {}
  // ========================================
// INIT
// ========================================

ngOnInit(): void {
  const user = this.authService.getCurrentUser();

  this.isTeacher = user?.role === 'teacher';
  this.isAdmin = user?.role === 'admin';

  this.loadSubjects();

  this.filteredQuestions = [];

  this.questions.push(
    this.createEmptyQuestion()
  );

}

// ========================================
// LOAD SUBJECTS
// ========================================

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

// ========================================
// LOAD TOPICS
// ========================================

loadTopics(subjectId: number): void {

  if (!subjectId) {

    this.topics = [];

    return;

  }

  this.examService
    .getTopics(subjectId)
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

        this.topics = [];

      }

    });

}

// ========================================
// SUBJECT CHANGE
// ========================================

onSubjectChange(): void {

  this.examData.topic_id = '';

  this.loadTopics(
    Number(
      this.examData.subject_id
    )
  );

}

// ========================================
// LOAD MY QUESTIONS
// ========================================

loadMyQuestions(): void {

  this.examService
    .getMyQuestions()
    .subscribe({

      next: (res:any)=>{

        this.myQuestions =
          res.data || [];

        this.filteredQuestions =
          [...this.myQuestions];

      },

      error: (err: any) => {

        console.error(
          'Load my questions failed',
          err
        );

        this.myQuestions = [];

      }

    });

}
// ======================================================
// MODE
// ======================================================

changeMode(
  mode: 'MANUAL' | 'IMPORT' | 'QUESTION_BANK'
): void {

  this.createMode = mode;

}

// ======================================================
// IMPORT FILE
// ======================================================

onQuestionFileChange(event: any): void {

  const file = event.target.files[0];

  if (!file) {
    return;
  }

  this.selectedQuestionFile = file;

  const reader = new FileReader();

  reader.onload = (e: any) => {

    const data = new Uint8Array(e.target.result);

    const workbook = XLSX.read(data, {
      type: 'array'
    });

    const sheet =
      workbook.Sheets[
        workbook.SheetNames[0]
      ];

    this.previewQuestions =
      XLSX.utils.sheet_to_json(sheet);

  };

  reader.readAsArrayBuffer(file);

}

// removeSelectedFile(): void {

//   this.selectedQuestionFile = null;

// }

// ======================================================
// QUESTION BANK
// ======================================================

toggleQuestion(question: QuestionItem): void {

  if (
    this.selectedQuestionIds.has(
      question.question_id
    )
  ) {

    this.selectedQuestionIds.delete(
      question.question_id
    );

  } else {

    this.selectedQuestionIds.add(
      question.question_id
    );

  }

}

isSelected(question: QuestionItem): boolean {

  return this.selectedQuestionIds.has(
    question.question_id
  );

}

// ======================================================
// FILTER QUESTION
// ======================================================

filterQuestions(): void {

  const keyword =
    this.keyword
      .trim()
      .toLowerCase();

  if (!keyword) {

    this.filteredQuestions =
      [...this.myQuestions];

    return;

  }

  this.filteredQuestions =
    this.myQuestions.filter(q =>

      q.content
        ?.toLowerCase()
        .includes(keyword)

    );

}

// ======================================================
// DOWNLOAD TEMPLATE
// ======================================================

downloadTemplate(): void {

  alert(
    'Tải file mẫu sẽ được bổ sung khi backend hỗ trợ.'
  );

}

// ======================================================
// VALIDATE
// ======================================================

validateForm(): boolean {

  // =============================
  // THÔNG TIN ĐỀ THI
  // =============================

  if (!this.examData.title.trim()) {

    alert('Vui lòng nhập tên đề thi.');

    return false;

  }

  if (!this.examData.subject_id) {

    alert('Vui lòng chọn môn học.');

    return false;

  }

  if (this.examData.duration <= 0) {

    alert('Thời gian làm bài không hợp lệ.');

    return false;

  }

  if (
    this.examData.is_random &&
    this.examData.random_question_count <= 0
  ) {

    alert('Vui lòng nhập số lượng câu hỏi ngẫu nhiên.');

    return false;

  }

  // =============================
  // TẠO THỦ CÔNG
  // =============================

  if (this.createMode === 'MANUAL') {

    if (this.questions.length === 0) {

      alert('Vui lòng thêm ít nhất 1 câu hỏi.');

      return false;

    }

    for (let i = 0; i < this.questions.length; i++) {

      const q = this.questions[i];

      if (!q.content.trim()) {

        alert(`Câu hỏi ${i + 1} chưa nhập nội dung.`);

        return false;

      }

      if (
        !q.answer_a.trim() ||
        !q.answer_b.trim() ||
        !q.answer_c.trim() ||
        !q.answer_d.trim()
      ) {

        alert(`Câu hỏi ${i + 1} chưa nhập đầy đủ đáp án.`);

        return false;

      }

      if (!q.correct_answer) {

        alert(`Câu hỏi ${i + 1} chưa chọn đáp án đúng.`);

        return false;

      }

    }

  }

  // =============================
  // IMPORT EXCEL
  // =============================

  if (
    this.createMode === 'IMPORT' &&
    !this.selectedQuestionFile
  ) {

    alert('Vui lòng chọn file Excel.');

    return false;

  }

  // =============================
  // BỘ CÂU HỎI
  // =============================

  if (
    this.createMode === 'QUESTION_BANK' &&
    this.selectedQuestionIds.size === 0
  ) {

    alert('Vui lòng chọn ít nhất một câu hỏi.');

    return false;

  }

  return true;

}

// ======================================================
// CREATE EXAM
// ======================================================

createExam(): void {

  if (!this.validateForm()) {
    return;
  }

  this.loading = true;

  const formData = new FormData();

  // =====================================
  // EXAM INFO
  // =====================================

  formData.append(
    'title',
    this.examData.title.trim()
  );

  formData.append(
    'description',
    this.examData.description || ''
  );

  formData.append(
    'subject_id',
    String(this.examData.subject_id)
  );

  if (this.examData.topic_id) {

    formData.append(
      'topic_id',
      String(this.examData.topic_id)
    );

  }

  formData.append(
    'duration',
    String(this.examData.duration)
  );

  formData.append(
    'pass_score',
    String(this.examData.pass_score)
  );

  formData.append(
    'visibility',
    this.examData.visibility
  );

  formData.append(
    'status_exam',
    this.examData.status_exam
  );

  formData.append(
    'is_random',
    String(this.examData.is_random)
  );

  formData.append(
    'random_question_count',
    String(this.examData.random_question_count)
  );

  formData.append(
    'shuffle_questions',
    String(this.examData.shuffle_questions)
  );

  formData.append(
    'shuffle_answers',
    String(this.examData.shuffle_answers)
  );

  formData.append(
    'allow_system_integration',
    String(this.examData.allow_system_integration)
  );

  formData.append(
    'create_mode',
    this.createMode
  );

  // =====================================
  // MANUAL
  // =====================================

  if (this.createMode === 'MANUAL') {

    formData.append(
      'questions',
      JSON.stringify(this.questions)
    );

  }

  // =====================================
  // IMPORT EXCEL
  // =====================================

  if (
    this.createMode === 'IMPORT' &&
    this.selectedQuestionFile
  ) {

    formData.append(
      'question_file',
      this.selectedQuestionFile
    );

  }

  // =====================================
  // QUESTION BANK
  // =====================================

  if (this.createMode === 'QUESTION_BANK') {

    formData.append(
      'question_ids',
      JSON.stringify(
        Array.from(this.selectedQuestionIds)
      )
    );

  }

  console.log(
    'Create Mode:',
    this.createMode
  );

  console.log(
    'Questions:',
    this.questions
  );

  console.log(
  "allow_system_integration =",
  this.examData.allow_system_integration
);

  this.examService
    .createExam(formData)
    .subscribe({

      next: (res: any) => {

        this.loading = false;

        console.log(
          'CREATE SUCCESS',
          res
        );

        alert(
          'Tạo đề thi thành công.'
        );

        this.router.navigate([
          '/dashboard/exams'
        ]);

      },

      error: (err: any) => {

        this.loading = false;

        console.error(
          'CREATE ERROR',
          err
        );

        alert(
          err?.error?.message ||
          'Tạo đề thi thất bại.'
        );

      }

    });

}

// ======================================================
// CANCEL
// ======================================================

cancel(): void {

  this.router.navigate([
    '/dashboard/exams'
  ]);

}

createEmptyQuestion(): ExamQuestion {

  return {

    content: '',

    answer_a: '',

    answer_b: '',

    answer_c: '',

    answer_d: '',

    correct_answer: 'A',

    difficulty: 'EASY',

    explanation: ''

  };

}

addQuestion() {

  this.questions.push(
    this.createEmptyQuestion()
  );

}

addManyQuestions(): void {

  if (this.addQuestionCount <= 0) {
    return;
  }

  for (let i = 0; i < this.addQuestionCount; i++) {
    this.addQuestion();
  }

  this.addQuestionCount = 1;

}

removeQuestion(index:number){

   this.questions.splice(index,1);

}

}