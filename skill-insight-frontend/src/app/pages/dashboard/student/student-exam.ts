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