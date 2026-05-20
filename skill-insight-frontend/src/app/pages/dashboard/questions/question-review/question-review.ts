// import {
//   Component,
//   OnInit
// } from '@angular/core';

// import {
//   CommonModule
// } from '@angular/common';

// import {
//   ActivatedRoute,
//   Router,
//   RouterModule
// } from '@angular/router';

// import {
//   FormsModule
// } from '@angular/forms';

// import { QuestionService } from '../../../../services/question.service';

// @Component({
//   selector: 'app-question-review',

//   standalone: true,

//   imports: [
//     CommonModule,
//     FormsModule,
//     RouterModule
//   ],

//   templateUrl:
//     './question-review.html',

//   styleUrls: [
//     './question-review.css'
//   ]
// })

// export class QuestionReview
// implements OnInit {

//   questions: any[] = [];

//   currentQuestion: any = null;

//   currentIndex = 0;

//   selectedAnswer = '';

//   showAnswer = false;

//   correctCount = 0;

//   answered = false;

//   loading = false;

//   constructor(

//     private questionService:
//       QuestionService,

//     private route:
//       ActivatedRoute,

//     private router: Router

//   ) {}

//   ngOnInit(): void {

//     this.loadQuestions();

//   }

//   loadQuestions(): void {

//     this.loading = true;

//     this.questionService
//       .getQuestions()
//       .subscribe({

//         next: (res: any) => {

//           this.questions =
//             res.questions || res || [];

//           if (
//             this.questions.length > 0
//           ) {

//             this.currentQuestion =
//               this.questions[0];

//           }

//           this.loading = false;

//         },

//         error: (err: any) => {

//           console.error(err);

//           this.loading = false;

//         }

//       });

//   }

//   selectAnswer(
//     answer: string
//   ): void {

//     if (this.answered) {

//       return;

//     }

//     this.selectedAnswer =
//       answer;

//   }

//   checkAnswer(): void {

//     if (!this.selectedAnswer) {

//       alert(
//         'Vui lòng chọn đáp án'
//       );

//       return;

//     }

//     this.showAnswer = true;

//     this.answered = true;

//     if (

//       this.selectedAnswer ===
//       this.currentQuestion
//         .correct_answer

//     ) {

//       this.correctCount++;

//     }

//   }

//   nextQuestion(): void {

//     if (

//       this.currentIndex <
//       this.questions.length - 1

//     ) {

//       this.currentIndex++;

//       this.currentQuestion =
//         this.questions[
//           this.currentIndex
//         ];

//       this.resetState();

//     }

//   }

//   previousQuestion(): void {

//     if (this.currentIndex > 0) {

//       this.currentIndex--;

//       this.currentQuestion =
//         this.questions[
//           this.currentIndex
//         ];

//       this.resetState();

//     }

//   }

//   resetState(): void {

//     this.selectedAnswer = '';

//     this.showAnswer = false;

//     this.answered = false;

//   }

//   getOptionClass(
//     option: string
//   ): string {

//     if (this.showAnswer) {

//       if (

//         option ===
//         this.currentQuestion
//           .correct_answer

//       ) {

//         return `
//           border-green-500
//           bg-green-50
//           text-green-700
//         `;

//       }

//       if (

//         option ===
//         this.selectedAnswer &&

//         option !==
//         this.currentQuestion
//           .correct_answer

//       ) {

//         return `
//           border-red-500
//           bg-red-50
//           text-red-700
//         `;

//       }

//     }

//     if (
//       this.selectedAnswer === option
//     ) {

//       return `
//         border-blue-500
//         bg-blue-50
//       `;

//     }

//     return `
//       border-gray-200
//       hover:border-blue-300
//       hover:bg-blue-50
//     `;

//   }

// }


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

import { QuestionService }
from '../../../../services/question.service';

@Component({
  selector: 'app-question-review',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule
  ],

  templateUrl:
    './question-review.html',

  styleUrls: [
    './question-review.css'
  ]
})

export class QuestionReview
implements OnInit {

  question: any = null;

  loading = false;

  questionId!: number;

  constructor(

    private questionService:
      QuestionService,

    private route:
      ActivatedRoute,

    private router: Router

  ) {}

  ngOnInit(): void {

    this.questionId =
      Number(
        this.route.snapshot.paramMap.get('id')
      );

    this.loadQuestion();

  }

  loadQuestion(): void {

    this.loading = true;

    this.questionService
      .getQuestionById(this.questionId)
      .subscribe({

        next: (res: any) => {

          this.question =
            res?.data || null;

          this.loading = false;

        },

        error: (err: any) => {

          console.error(err);

          this.loading = false;

        }

      });

  }

  approveQuestion(): void {

    const confirmApprove =
      confirm(
        'Duyệt câu hỏi này?'
      );

    if (!confirmApprove) {

      return;

    }

    this.questionService
      .approveQuestion(this.questionId)
      .subscribe({

        next: () => {

          alert(
            'Duyệt câu hỏi thành công'
          );

          this.router.navigate([
            '/dashboard/questions'
          ]);

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

}