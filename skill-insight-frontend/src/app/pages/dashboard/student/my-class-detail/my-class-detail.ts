import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';

import { ClassService } from '../../../../services/class.service';

@Component({
  selector: 'app-my-class-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './my-class-detail.html',
  styleUrl: './my-class-detail.css'
})
export class MyClassDetailComponent implements OnInit {

  loading = false;

  classId = 0;

  classDetail: any = {};

  students: any[] = [];

  assignments: any[] = [];

  // NEW
  tab: 'stream' | 'classwork' | 'people' = 'stream';

  selectedAssignment: any = null;

  constructor(
    private route: ActivatedRoute,
    private classService: ClassService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.classId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.loadDetail();
  }

  loadDetail(): void {

    this.loading = true;

    this.classService
      .getClassById(this.classId)
      .subscribe({

        next: (res: any) => {

          this.loading = false;

          this.classDetail =
            res.data ?? res;

          this.students =
            this.classDetail.students ?? [];

          this.assignments =
            this.classDetail.assignments ?? [];
        },

        error: err => {

          this.loading = false;

          console.error(err);
        }

      });

  }

  getAssignmentStatus(item: any): string {

      const now = new Date();

      const start = new Date(item.start_at);

      const end = new Date(item.end_at);

      if (now < start) {

          return "Chưa mở";

      }

      if (now > end) {

          return "Đã kết thúc";

      }

      return "Đang diễn ra";

  }

  getAssignmentStatusClass(item: any): any {

      const status = this.getAssignmentStatus(item);

      return {

          "bg-yellow-100 text-yellow-700":
              status === "Chưa mở",

          "bg-green-100 text-green-700":
              status === "Đang diễn ra",

          "bg-red-100 text-red-700":
              status === "Đã kết thúc"

      };

  }

  canStart(item: any): boolean {

      return this.getAssignmentStatus(item)
          === "Đang diễn ra";

  }

  startExam(item: any): void {

    console.log(item);

    this.router.navigate([
      '/dashboard/my-exams/take',
      item.assignment_id
    ]);

  }

  changeTab(tab: 'stream' | 'classwork' | 'people') {

    this.tab = tab;

  }

  openAssignment(item:any){

    this.selectedAssignment=item;

  }

  closeAssignment(){

    this.selectedAssignment=null;

  }

}