import {
  Component,
  OnInit
} from "@angular/core";

import {
  CommonModule
} from "@angular/common";

import {
  ActivatedRoute,
  RouterModule
} from "@angular/router";

import {
  StudentExamService
} from "../../../services/student-exam.service";

@Component({
  selector: "app-result",
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  template: "<div>Result Component</div>"
})
export class ResultComponent
  implements OnInit {

  result: any = null;

  loading = true;

  constructor(
    private route: ActivatedRoute,
    private service: StudentExamService
  ) {}

  ngOnInit(): void {

    const id =
      this.route.snapshot.paramMap.get("id");

    if (id) {

      this.loadResult(id);

    }

  }

  /**
   * LOAD RESULT
   */
  loadResult(id: string): void {

    this.loading = true;

    this.service
      .getResult(id)
      .subscribe({

        next: (res: any) => {

          this.result = res;

          this.loading = false;

        },

        error: (err) => {

          console.error(err);

          this.loading = false;

          alert("Không tải được kết quả");

        }

      });

  }

  /**
   * WRONG ANSWERS
   */
  get wrongAnswers(): number {

    if (!this.result) return 0;

    return (
      this.result.correct_answers -
      this.result.total_questions
    ) * -1;

  }

}
