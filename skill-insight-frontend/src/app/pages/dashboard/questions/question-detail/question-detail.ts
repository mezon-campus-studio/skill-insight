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

import { QuestionService } from '../../../../services/question.service';

@Component({
  selector: 'app-question-detail',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule
  ],

  templateUrl:
    './question-detail.html',

  styleUrls: [
    './question-detail.css'
  ]
})

export class QuestionDetail
implements OnInit {

  question: any = null;

  loading = false;

  questionId!: number;

  constructor(

    private route:
      ActivatedRoute,

    private router: Router,

    private questionService:
      QuestionService

  ) {}

  ngOnInit(): void {

    this.questionId =
      Number(

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
    .getQuestionById(
    this.questionId
  )
  .subscribe({

    next: (res: any) => {

      this.question =
        res?.data || null;

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

  goBack(): void {

    this.router.navigate([
      '/dashboard/questions'
    ]);

  }

}