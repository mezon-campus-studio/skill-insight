import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';

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

  constructor(
    private route: ActivatedRoute,
    private classService: ClassService
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

}