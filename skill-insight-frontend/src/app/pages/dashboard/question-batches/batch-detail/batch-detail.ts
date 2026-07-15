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

  // =====================================================
  // DIRTY
  // =====================================================

  dirtyMap = new Set<number>();

  private change$ = new Subject<void>();

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

          this.batch =

            res.data || res;

          this.questions =

            this.batch.questions || [];

          this.filteredQuestions = [

            ...this.questions

          ];

          this.calculateStats();

          this.loading = false;

        },

        error: (err) => {

          console.error(err);

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

    this.markDirty(question);

  }

  onExplanationChange(question: any): void {

    this.markDirty(question);

  }

  onAnswerChange(question: any): void {

    this.markDirty(question);

  }

  setCorrectAnswer(

    question: any,

    answer: string

  ): void {

    question.correct_answer = answer;

    this.markDirty(question);

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

  saveQuestion(question: any): void {

    const payload = {

      question_text: question.question_text,

      option_a: question.option_a,

      option_b: question.option_b,

      option_c: question.option_c,

      option_d: question.option_d,

      correct_answer: question.correct_answer,

      difficulty: question.difficulty,

      explanation: question.explanation

    };

    this.batchService

      .updateQuestion(

        question.question_id,

        payload

      )

      .subscribe({

        next: () => {

          this.dirtyMap.delete(

            question.question_id

          );

          alert('Đã lưu câu hỏi');

        },

        error: (err: any) => {

          console.error(err);

          alert(

            err?.error?.message ||

            'Lưu thất bại'

          );

        }

      });

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

}