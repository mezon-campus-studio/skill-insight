import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  Router,
  RouterModule
} from '@angular/router';

import {
  FormsModule
} from '@angular/forms';

import {
  Subject,
  debounceTime
} from 'rxjs';

import {
  QuestionBatchService
} from '../../../../services/question-batch.service';

@Component({
  selector: 'app-batch-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './batch-detail.html',
  styleUrl: './batch-detail.css'
})

export class BatchDetail implements OnInit {

  // =====================================================
  // DATA
  // =====================================================

  batch: any = null;

  questions: any[] = [];

  filteredQuestions: any[] = [];

  loading = true;

  batchId = 0;

  saving = false;

  saveMessage = '';

  // =====================================================
  // DIRTY
  // =====================================================

  dirtyMap = new Set<number>();

  private change$ = new Subject<void>();
  private saveTimer: any; 

  // =====================================================
  // FILTER
  // =====================================================

  searchKeyword = '';

  selectedLevel = '';

  // =====================================================
  // CREATE QUESTION
  // =====================================================

  newQuestionCount = 1;

  creating = false;

  // =====================================================
  // STATISTIC
  // =====================================================

  easyCount = 0;

  mediumCount = 0;

  hardCount = 0;

  constructor(

    private route: ActivatedRoute,

    private router: Router,

    private batchService: QuestionBatchService

  ) {

    this.change$

      .pipe(

        debounceTime(800)

      )

      .subscribe();

  }

  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.batchId = Number(

      this.route.snapshot.paramMap.get('id')

    );

    if (!this.batchId) {

      this.router.navigate([
        '/dashboard/question-bank'
      ]);

      return;

    }

    this.loadBatchDetail();

  }

  // =====================================================
  // LOAD DETAIL
  // =====================================================

  loadBatchDetail(): void {

    this.loading = true;

    this.batchService
      .getQuestionBatchById(this.batchId)
      .subscribe({

        next: (res: any) => {

          this.batch = res.data;

          this.batch = res.data;

          const user = JSON.parse(localStorage.getItem('user') || '{}');

          if (
            user.role !== 'admin' &&
            this.batch.teacher_id !== user.user_id
          ) {
            alert('Bạn không có quyền sửa bộ câu hỏi này.');
            this.router.navigate(['/dashboard/question-bank']);
            return;
          }

          this.questions = (this.batch.questions || []).map((item: any) => {

            const q = item.question;

            const answers = [...(q.answers || [])];

            answers.sort(
              (a, b) => a.answer_order - b.answer_order
            );

            return {

              question_id: q.question_id,

              question_text: q.content,

              difficulty: q.level,

              explanation: q.explanation,

              option_a: answers[0]?.answer_text || '',

              option_b: answers[1]?.answer_text || '',

              option_c: answers[2]?.answer_text || '',

              option_d: answers[3]?.answer_text || '',

              correct_answer:

                answers.findIndex(a => a.is_correct) === 0 ? 'A' :

                answers.findIndex(a => a.is_correct) === 1 ? 'B' :

                answers.findIndex(a => a.is_correct) === 2 ? 'C' :

                answers.findIndex(a => a.is_correct) === 3 ? 'D' : ''

            };

          });

          this.filteredQuestions = [...this.questions];

          this.calculateStats();

          this.loading = false;

        }
              });

  }

  // =====================================================
  // DIRTY
  // =====================================================

  markDirty(question: any): void {

    this.dirtyMap.add(

      question.question_id

    );

    this.change$.next();

  }

  isDirty(question: any): boolean {

    return this.dirtyMap.has(

      question.question_id

    );

  }

  onContentChange(question: any): void {

    this.saveQuestion(question);

  }

  onExplanationChange(question: any): void {

    this.saveQuestion(question);

  }

  onAnswerChange(question: any): void {

    this.saveQuestion(question);

  }

  setCorrectAnswer(question: any, answer: string): void {

    question.correct_answer = answer;

    this.saveQuestion(question);

  }

  // =====================================================
  // FILTER
  // =====================================================

  filterQuestions(): void {

    let data = [

      ...this.questions

    ];

    if (

      this.searchKeyword.trim()

    ) {

      data = data.filter(

        q =>

          q.question_text

            ?.toLowerCase()

            .includes(

              this.searchKeyword

                .toLowerCase()

            )

      );

    }

    if (

      this.selectedLevel

    ) {

      data = data.filter(

        q =>

          q.difficulty ===

          this.selectedLevel

      );

    }

    this.filteredQuestions = data;

  }

  // =====================================================
  // STATISTIC
  // =====================================================

  calculateStats(): void {

    this.easyCount =

      this.questions.filter(

        q =>

          q.difficulty === 'EASY'

      ).length;

    this.mediumCount =

      this.questions.filter(

        q =>

          q.difficulty === 'MEDIUM'

      ).length;

    this.hardCount =

      this.questions.filter(

        q =>

          q.difficulty === 'HARD'

      ).length;

  }

  // =====================================================
  // LABEL
  // =====================================================

  getLevelLabel(level: string): string {

    switch (level) {

      case 'EASY':
        return 'Dễ';

      case 'MEDIUM':
        return 'Trung bình';

      case 'HARD':
        return 'Khó';

      default:
        return level;

    }

  }

  getLevelClass(level: string): string {

    switch (level) {

      case 'EASY':
        return 'bg-green-100 text-green-700';

      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-700';

      case 'HARD':
        return 'bg-red-100 text-red-700';

      default:
        return 'bg-gray-100';

    }

  }

    // =====================================================
    // SAVE QUESTION
    // =====================================================

    private saveTimers: Record<number, any> = {};

    saveQuestion(question: any): void {

      clearTimeout(this.saveTimers[question.question_id]);

      this.saving = true;

      this.saveMessage = 'Đang lưu...';

      this.saveTimers[question.question_id] = setTimeout(() => {

        const data = {

          content: question.question_text,

          explanation: question.explanation,

          level: question.difficulty,

          answers: [

            {
              answer_order: 1,
              answer_text: question.option_a,
              is_correct: question.correct_answer === 'A'
            },

            {
              answer_order: 2,
              answer_text: question.option_b,
              is_correct: question.correct_answer === 'B'
            },

            {
              answer_order: 3,
              answer_text: question.option_c,
              is_correct: question.correct_answer === 'C'
            },

            {
              answer_order: 4,
              answer_text: question.option_d,
              is_correct: question.correct_answer === 'D'
            }

          ]

        };

        this.batchService
          .updateQuestion(
            question.question_id,
            data
          )
          .subscribe({

            next: () => {

              this.saving = false;

              this.saveMessage = '✓ Đã lưu';

              setTimeout(() => {

                if (this.saveMessage === '✓ Đã lưu') {

                  this.saveMessage = '';

                }

              }, 1500);

            },

            error: (err) => {

              console.error(err);

              this.saving = false;

              this.saveMessage = '❌ Lưu thất bại';

            }

          });

      }, 800);

    }

  // =====================================================
  // ADD QUESTION
  // =====================================================

  addQuestions(): void {

    const newQuestion = {

      question_id: Date.now(),

      question_text: '',

      option_a: '',

      option_b: '',

      option_c: '',

      option_d: '',

      correct_answer: 'A',

      difficulty: 'EASY',

      explanation: ''

    };

    this.questions.unshift(newQuestion);

    this.filteredQuestions = [

      ...this.questions

    ];

    this.calculateStats();

  }

  // =====================================================
  // ADD MULTIPLE QUESTIONS
  // =====================================================

  addQuestionsManually(): void {

    if (

      this.newQuestionCount <= 0

    ) {

      return;

    }

    const list = Array.from(

      {

        length: this.newQuestionCount

      }

    ).map((_, index) => ({

      question_id:

        Date.now() + index,

      question_text: '',

      option_a: '',

      option_b: '',

      option_c: '',

      option_d: '',

      correct_answer: 'A',

      difficulty: 'EASY',

      explanation: ''

    }));

    this.questions = [

      ...list,

      ...this.questions

    ];

    this.filteredQuestions = [

      ...this.questions

    ];

    this.calculateStats();

  }

  // =====================================================
  // DELETE QUESTION
  // =====================================================

  deleteQuestion(

    questionId: number

  ): void {

    if (

      !confirm(

        'Bạn có chắc muốn xóa câu hỏi này?'

      )

    ) {

      return;

    }

    this.batchService

      .removeQuestionFromBatch(

        this.batchId,

        questionId

      )

      .subscribe({

        next: () => {

          this.questions =

            this.questions.filter(

              q =>

                q.question_id !==

                questionId

            );

          this.filteredQuestions =

            this.filteredQuestions.filter(

              q =>

                q.question_id !==

                questionId

            );

          this.dirtyMap.delete(

            questionId

          );

          this.calculateStats();

        },

        error: (err: any) => {

          alert(

            err?.error?.message ||

            'Không thể xóa'

          );

        }

      });

  }

  // =====================================================
  // DELETE BATCH
  // =====================================================

  deleteBatch(): void {

    if (

      !confirm(

        'Bạn có chắc muốn xóa bộ câu hỏi?'

      )

    ) {

      return;

    }

    this.batchService

      .deleteQuestionBatch(

        this.batchId

      )

      .subscribe({

        next: () => {

          alert(

            'Đã xóa bộ câu hỏi'

          );

          this.router.navigate([

            '/dashboard/question-bank'

          ]);

        },

        error: (err: any) => {

          alert(

            err?.error?.message ||

            'Không thể xóa'

          );

        }

      });

  }

  // =====================================================
  // IMPORT EXCEL
  // =====================================================

  importExcel(event: any): void {

    const file =

      event.target.files?.[0];

    if (!file) {

      return;

    }

    const formData =

      new FormData();

    formData.append(

      'file',

      file

    );

    formData.append(

      'batch_id',

      this.batchId.toString()

    );

    this.batchService

      .importQuestionsExcel(

        formData

      )

      .subscribe({

        next: (res: any) => {

          const data =

            res.data || [];

          this.questions = [

            ...data,

            ...this.questions

          ];

          this.filteredQuestions = [

            ...this.questions

          ];

          this.calculateStats();

          alert(

            'Import thành công'

          );

        },

        error: (err: any) => {

          console.error(err);

          alert(

            err?.error?.message ||

            'Import thất bại'

          );

        }

      });

  }

  // =====================================================
  // TRACK BY
  // =====================================================

  trackByQuestion(

    index: number,

    item: any

  ) {

    return item.question_id;

  }

  scheduleSave(question: any): void {

    clearTimeout(this.saveTimer);

    this.saving = true;

    this.saveMessage = ' Đang lưu...';

    this.saveTimer = setTimeout(() => {

      this.saveQuestion(question);

    }, 800);

  }
  back(): void {

    this.router.navigate([
      '/dashboard/question-bank'
    ]);

  }

}