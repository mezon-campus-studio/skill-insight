import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { QuestionBatchService } from '../../../../services/question-batch.service';
import { Subject, debounceTime } from 'rxjs';

@Component({
  selector: 'app-batch-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './batch-detail.html',
  styleUrl: './batch-detail.css',
})
export class BatchDetail implements OnInit {

  // =========================
  // DATA
  // =========================
  batch: any = null;
  questions: any[] = [];
  filteredQuestions: any[] = [];
  loading = true;
  batchId = 0;

  // =========================
  // DIRTY STATE
  // =========================
  dirtyMap: Set<number> = new Set();
  private change$ = new Subject<void>();

  // =========================
  // FILTER
  // =========================
  searchKeyword = '';
  selectedLevel = '';

  // =========================
  // ADD QUESTION (MANUAL)
  // =========================
  newQuestionCount: number = 1;
  creating = false;

  // =========================
  // STATS
  // =========================
  easyCount = 0;
  mediumCount = 0;
  hardCount = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private batchService: QuestionBatchService
  ) {
    this.change$
      .pipe(debounceTime(800))
      .subscribe();
  }

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {

    this.batchId = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.batchId) {
      this.router.navigate(['/dashboard/question-batches']);
      return;
    }

    this.loadBatchDetail();
  }

  // =========================
  // LOAD DATA
  // =========================
  loadBatchDetail(): void {

    this.loading = true;

    this.batchService.getQuestionBatchById(this.batchId)
      .subscribe({

        next: (res: any) => {

          this.batch = res?.data || res;

          this.questions = (this.batch?.questions || [])
            .filter((x: any) => x?.question)
            .map((x: any) => {
              const q = x.question;

              return {
                ...q,
                question_order: x.question_order,
                answers: (q.answers || []).map((a: any) => ({ ...a }))
              };
            });

          this.filteredQuestions = [...this.questions];

          this.calculateStats();
          this.loading = false;
        },

        error: () => this.loading = false
      });
  }

  // =========================
  // DIRTY TRACKING
  // =========================
  markDirty(q: any) {
    this.dirtyMap.add(q.question_id);
    this.change$.next();
  }

  isDirty(q: any): boolean {
    return this.dirtyMap.has(q.question_id);
  }

  onContentChange(q: any) { this.markDirty(q); }
  onExplanationChange(q: any) { this.markDirty(q); }
  onAnswerChange(q: any) { this.markDirty(q); }

  setCorrectAnswer(q: any, index: number) {
    q.answers.forEach((a: any, i: number) => {
      a.is_correct = i === index;
    });
    this.markDirty(q);
  }

  // =========================
  // SAVE SINGLE QUESTION
  // =========================
  saveQuestion(q: any): void {

    const payload = {
      content: q.content,
      explanation: q.explanation,
      level: q.level,
      answers: q.answers.map((a: any) => ({
        answer_text: a.answer_text,
        is_correct: a.is_correct
      }))
    };

    this.batchService.updateQuestion(q.question_id, payload)
      .subscribe({

        next: () => {
          this.dirtyMap.delete(q.question_id);
        },

        error: (err) => {
          alert(err?.error?.message || 'Lưu thất bại');
        }
      });
  }

  // =========================
  // FILTER
  // =========================
  filterQuestions(): void {

    let data = [...this.questions];

    if (this.searchKeyword.trim()) {
      data = data.filter(q =>
        q.content?.toLowerCase().includes(this.searchKeyword.toLowerCase())
      );
    }

    if (this.selectedLevel) {
      data = data.filter(q => q.level === this.selectedLevel);
    }

    this.filteredQuestions = data;
  }

  // =========================
  // DELETE QUESTION
  // =========================
  deleteQuestion(id: number): void {

    if (!confirm('Xóa câu hỏi?')) return;

    this.batchService.removeQuestionFromBatch(this.batchId, id)
      .subscribe({

        next: () => {
          this.questions = this.questions.filter(q => q.question_id !== id);
          this.filteredQuestions = this.filteredQuestions.filter(q => q.question_id !== id);
          this.dirtyMap.delete(id);
          this.calculateStats();
        }
      });
  }

  // =========================
  // DELETE BATCH
  // =========================
  deleteBatch(): void {

    if (!confirm('Xóa batch?')) return;

    this.batchService.deleteQuestionBatch(this.batchId)
      .subscribe({

        next: () => {
          this.router.navigate(['/dashboard/question-batches']);
        }
      });
  }

  // =========================
  // APPROVE
  // =========================
  approveBatch(): void {

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    this.batchService.approveBatch(this.batchId, {
      user_id: user.userId || user.user_id
    }).subscribe({

      next: () => {
        this.batch.status = 'APPROVED';
      }
    });
  }

  // =========================
  // ADD QUESTIONS MANUALLY
  // =========================
  addQuestionsManually(): void {

    if (this.newQuestionCount <= 0) return;

    const newQuestions = Array.from({ length: this.newQuestionCount }).map((_, i) => ({

      question_id: Date.now() + i,
      content: 'Câu hỏi mới',
      explanation: '',
      level: 'EASY',
      question_type: 'MULTIPLE_CHOICE',

      answers: [
        { answer_text: 'A', is_correct: true },
        { answer_text: 'B', is_correct: false },
        { answer_text: 'C', is_correct: false },
        { answer_text: 'D', is_correct: false }
      ]
    }));

    this.questions = [...newQuestions, ...this.questions];
    this.filteredQuestions = [...this.questions];

    this.calculateStats();
  }

  // =========================
  // IMPORT (HOOK)
  // =========================
  importQuestions(event: any): void {
    console.log('IMPORT FILE:', event);
    alert('Chức năng import chưa nối API');
  }

  // =========================
  // STATS
  // =========================
  calculateStats(): void {

    this.easyCount = this.questions.filter(q => q.level === 'EASY').length;
    this.mediumCount = this.questions.filter(q => q.level === 'MEDIUM').length;
    this.hardCount = this.questions.filter(q => q.level === 'HARD').length;
  }

  // =========================
  // UI HELPERS
  // =========================
  getLevelLabel(level: string) {
    switch (level) {
      case 'EASY': return 'Dễ';
      case 'MEDIUM': return 'Trung bình';
      case 'HARD': return 'Khó';
      default: return '';
    }
  }

  getLevelClass(level: string) {
    switch (level) {
      case 'EASY': return 'bg-green-100 text-green-700';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-700';
      case 'HARD': return 'bg-red-100 text-red-700';
      default: return '';
    }
  }

  getQuestionTypeLabel(type: string) {
    switch (type) {
      case 'MULTIPLE_CHOICE': return 'Nhiều đáp án';
      case 'SINGLE_CHOICE': return 'Một đáp án';
      case 'TRUE_FALSE': return 'Đúng/Sai';
      case 'ESSAY': return 'Tự luận';
      default: return type;
    }
  }

  // =========================
  // TRACK
  // =========================
  trackByQuestion(index: number, item: any) {
    return item.question_id;
  }
  addQuestions(): void {

  const newQ = {
    question_id: Date.now(),
    content: 'Nhập câu hỏi...',
    explanation: '',
    level: 'EASY',
    question_type: 'MULTIPLE_CHOICE',
    answers: [
      { answer_text: 'Đáp án A', is_correct: true },
      { answer_text: 'Đáp án B', is_correct: false },
      { answer_text: 'Đáp án C', is_correct: false },
      { answer_text: 'Đáp án D', is_correct: false },
    ]
  };

  this.questions = [newQ, ...this.questions];
  this.filteredQuestions = [...this.questions];

  this.calculateStats();
}

importExcel(event: any): void {

  const file = event.target.files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);
  formData.append('batch_id', this.batchId.toString());

  this.batchService.importQuestionsExcel(formData)
    .subscribe({
      next: (res: any) => {

        const newQuestions = res?.data || [];

        this.questions = [...newQuestions, ...this.questions];
        this.filteredQuestions = [...this.questions];

        this.calculateStats();

        alert('Import thành công!');
      },
      error: (err) => {
        alert(err?.error?.message || 'Import thất bại');
      }
    });
}

}