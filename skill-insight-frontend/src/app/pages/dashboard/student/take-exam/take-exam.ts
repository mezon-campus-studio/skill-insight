import {
  Component,
  OnInit,
  OnDestroy
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AssignmentService } from '../../../../services/assignment.service';

@Component({
  selector: 'app-take-exams',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule
  ],
  templateUrl: './take-exam.html',
  styleUrl: './take-exam.css'
})
export class TakeExam
  implements OnInit, OnDestroy {

  loading = false;

  submitted = false;

  assignmentId = 0;

  assignment: any = null;

  questions: any[] = [];

  currentQuestionIndex = 0;

  answers: {
    [questionId: number]: number
  } = {};

  remainingSeconds = 0;

  timer: any;

  constructor(

    private route: ActivatedRoute,

    private assignmentService: AssignmentService

  ) {}

  ngOnInit(): void {

    this.assignmentId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.loadExam();

  }

  ngOnDestroy(): void {

    if (this.timer) {

      clearInterval(this.timer);

    }

  }

  // ============================
  // LOAD
  // ============================

  loadExam(): void {

    this.loading = true;

    this.assignmentService
      .getAssignmentById(this.assignmentId)
      .subscribe({

        next: (res) => {

          this.assignment = res.data;

          this.questions =
            this.assignment.assignment_questions
              .map((item: any) => item.question)
              .filter((q: any) => q);

          this.remainingSeconds =
            this.assignment.duration * 60;

          this.startTimer();

          this.loading = false;

        },

        error: (err) => {

          console.error(err);

          this.loading = false;

        }

      });

  }
  
  // ============================
  // TIMER
  // ============================

  startTimer(): void {

    this.timer = setInterval(() => {

      if (this.remainingSeconds > 0) {

        this.remainingSeconds--;

      }

      else {

        clearInterval(this.timer);

        this.submitExam();

      }

    }, 1000);

  }

  get remainingTime(): string {

    const minute =
      Math.floor(this.remainingSeconds / 60);

    const second =
      this.remainingSeconds % 60;

    return `${minute
      .toString()
      .padStart(2, '0')}:${second
      .toString()
      .padStart(2, '0')}`;

  }

  // ============================
  // QUESTION
  // ============================

  get currentQuestion(): any {

    return this.questions[
      this.currentQuestionIndex
    ];

  }

  previousQuestion(): void {

    if (this.currentQuestionIndex > 0) {

      this.currentQuestionIndex--;

    }

  }

  nextQuestion(): void {

    if (

      this.currentQuestionIndex <
      this.questions.length - 1

    ) {

      this.currentQuestionIndex++;

    }

  }

  goQuestion(index: number): void {

    this.currentQuestionIndex = index;

  }

  // ============================
  // ANSWER
  // ============================

  selectAnswer(
    questionId: number,
    answerId: number
  ): void {

    this.answers[
      questionId
    ] = answerId;

  }

  hasAnswered(
    questionId: number
  ): boolean {

    return !!this.answers[
      questionId
    ];

  }

  get answeredCount(): number {

    return Object.keys(
      this.answers
    ).length;

  }

  // ============================
  // SUBMIT
  // ============================

  submitExam(): void {

    if (this.submitted) {

      return;

    }

    this.submitted = true;

    if (this.timer) {

      clearInterval(this.timer);

    }

    console.log({

      assignmentId:
        this.assignment.assignment_id,

      answers:
        this.answers

    });

    // TODO:
    // submit API

    alert('Đã nộp bài.');

  }

}