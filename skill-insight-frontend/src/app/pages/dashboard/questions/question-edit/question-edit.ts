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
  ActivatedRoute,
  Router,
  RouterModule
} from '@angular/router';

import { QuestionService }
from '../../../../services/question.service';

@Component({
  selector: 'app-question-edit',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],

  templateUrl: './question-edit.html',

  styleUrls: ['./question-edit.css']
})

export class QuestionEdit
implements OnInit {

  loading = false;

  saving = false;

  questionId!: number;

  questionData: any = {

    content: '',

    level: 'EASY',

    explanation: '',

    answers: [

      {
        answer_text: '',
        is_correct: true
      },

      {
        answer_text: '',
        is_correct: false
      },

      {
        answer_text: '',
        is_correct: false
      },

      {
        answer_text: '',
        is_correct: false
      }

    ]

  };

  constructor(

    private route:
      ActivatedRoute,

    private router:
      Router,

    private questionService:
      QuestionService

  ) {}

  ngOnInit(): void {

    this.questionId = Number(

      this.route.snapshot.paramMap.get(
        'id'
      )

    );

    if (!this.questionId) {

      this.router.navigate([
        '/dashboard/questions'
      ]);

      return;

    }

    this.loadQuestion();

  }

  loadQuestion(): void {

    this.loading = true;

    this.questionService
      .getQuestionById(this.questionId)
      .subscribe({

        next: (res: any) => {

          const question =
            res.data || res;

          this.questionData = {

            content:
              question.content || '',

            level:
              question.level || 'EASY',

            explanation:
              question.explanation || '',

            answers:
              question.answers || []

          };

          this.loading = false;

        },

        error: (err: any) => {

          console.error(err);

          this.loading = false;

          alert(
            'Không tìm thấy câu hỏi'
          );

          this.router.navigate([
            '/dashboard/questions'
          ]);

        }

      });

  }

  selectCorrectAnswer(index: number): void {

    this.questionData.answers
      .forEach((a: any) => {

        a.is_correct = false;

      });

    this.questionData
      .answers[index]
      .is_correct = true;

  }

  addAnswer(): void {

    this.questionData.answers.push({

      answer_text: '',
      is_correct: false

    });

  }

  removeAnswer(index: number): void {

    if (
      this.questionData.answers.length <= 2
    ) {

      alert(
        'Phải có ít nhất 2 đáp án'
      );

      return;

    }

    this.questionData
      .answers.splice(index, 1);

  }

  submitForm(): void {

    if (
      !this.questionData.content.trim()
    ) {

      alert(
        'Vui lòng nhập câu hỏi'
      );

      return;

    }

    const hasCorrect =
      this.questionData.answers.some(

        (a: any) => a.is_correct

      );

    if (!hasCorrect) {

      alert(
        'Vui lòng chọn đáp án đúng'
      );

      return;

    }

    this.saving = true;

    this.questionService
      .updateQuestion(

        this.questionId,

        this.questionData

      )
      .subscribe({

        next: () => {

          this.saving = false;

          alert(
            'Cập nhật câu hỏi thành công'
          );

          this.router.navigate([
            '/dashboard/questions'
          ]);

        },

        error: (err: any) => {

          console.error(err);

          this.saving = false;

          alert(
            err?.error?.message ||
            'Có lỗi xảy ra'
          );

        }

      });

  }

}