<<<<<<< HEAD
import {
  Component,
  OnInit,
  OnDestroy
} from "@angular/core";

import {
  CommonModule
} from "@angular/common";

import {
  FormsModule
} from "@angular/forms";

import {
  ActivatedRoute,
  Router
} from "@angular/router";

import {
  StudentExamService
} from "../../../services/student-exam.service";

@Component({
  selector: "app-student-exam",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: "./student-exam.html",
})
export class StudentExamComponent
  implements OnInit, OnDestroy {

  exam: any = null;

  loading = true;

  submitting = false;

  answers: Record<number, number> = {};

  timeLeft = 0;

  timer: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private examService: StudentExamService
  ) {}

  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get("id");

    if (id) {

      this.loadExam(id);

    }

  }

  ngOnDestroy(): void {

    if (this.timer) {

      clearInterval(this.timer);

    }

  }

  /**
   * LOAD EXAM
   */
  loadExam(id: string): void {

    this.loading = true;

    this.examService
      .getExam(id)
      .subscribe({

        next: (res: any) => {

          this.exam = res;

          this.timeLeft =
            (this.exam.duration || 30) * 60;

          this.startTimer();

          this.loading = false;

        },

        error: (err) => {

          console.error(err);

          this.loading = false;

          alert("Không tải được đề thi");

        }

      });

  }

  /**
   * TIMER
   */
  startTimer(): void {

    this.timer =
      setInterval(() => {

        this.timeLeft--;

        if (this.timeLeft <= 0) {

          clearInterval(this.timer);

          alert("Hết thời gian làm bài!");

          this.submitExam();

        }

      }, 1000);

  }

  /**
   * FORMAT TIME
   */
  get formattedTime(): string {

    const minutes =
      Math.floor(this.timeLeft / 60)
        .toString()
        .padStart(2, "0");

    const seconds =
      (this.timeLeft % 60)
        .toString()
        .padStart(2, "0");

    return `${minutes}:${seconds}`;

  }

  /**
   * ANSWER COUNT
   */
  get answeredCount(): number {

    return Object.keys(this.answers).length;

  }

  /**
   * SELECT ANSWER
   */
  selectAnswer(
    questionId: number,
    answerId: number
  ): void {

    this.answers[questionId] =
      answerId;

  }

  /**
   * CHECK SELECTED
   */
  isSelected(
    questionId: number,
    answerId: number
  ): boolean {

    return (
      this.answers[questionId] ===
      answerId
    );

  }

  /**
   * SUBMIT EXAM
   */
  submitExam(): void {

    if (this.submitting) return;

    this.submitting = true;

    clearInterval(this.timer);

    const user =
      JSON.parse(
        localStorage.getItem("user") || "{}"
      );

    const payload = {

      examId:
        this.exam.id,

      userId:
        user.id,

      answers:
        this.answers,

    };

    this.examService
      .submitExam(payload)
      .subscribe({

        next: (res: any) => {

          alert("Nộp bài thành công");

          this.router.navigate([
            "/dashboard/result",
            res.resultId
          ]);

        },

        error: (err) => {

          console.error(err);

          this.submitting = false;

          alert("Nộp bài thất bại");

        }

      });

  }

}
=======
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-exam',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-gray-50 p-6">
      <div class="max-w-4xl mx-auto bg-white p-10 rounded-[40px] shadow-2xl relative">
        <div class="flex justify-between items-center mb-10 border-b pb-6">
          <h2 class="text-2xl font-black text-gray-800">ĐANG LÀM BÀI: TOÁN 12</h2>
          <div class="px-6 py-3 bg-red-500 text-white rounded-2xl font-black text-xl tracking-tighter">
            29:59
          </div>
        </div>

        <div class="space-y-8">
          <div *ngFor="let q of [1,2,3]; let i = index" class="p-6 bg-blue-50/50 rounded-[30px] border border-blue-100">
            <p class="font-bold text-lg mb-4 text-gray-700">Câu {{i+1}}: Nội dung câu hỏi trắc nghiệm?</p>
            <div class="grid grid-cols-1 gap-3">
              <label *ngFor="let opt of ['A','B','C','D']" class="flex items-center gap-4 p-4 bg-white rounded-2xl cursor-pointer hover:border-blue-400 border-2 border-transparent transition-all">
                <input type="radio" [name]="'q'+i" class="w-5 h-5 accent-blue-600">
                <span class="font-bold text-gray-600">Đáp án {{opt}}</span>
              </label>
            </div>
          </div>
        </div>

        <button class="mt-10 w-full bg-blue-600 text-white py-5 rounded-[25px] font-black text-xl shadow-2xl shadow-blue-200 uppercase tracking-widest active:scale-95 transition-all">
          NỘP BÀI THI NGAY
        </button>
      </div>
    </div>
  `
})
export class StudentExamComponent {}
>>>>>>> 7831c51b0f00e6b70f4c2d7230e7bc7f04f9e0b5
