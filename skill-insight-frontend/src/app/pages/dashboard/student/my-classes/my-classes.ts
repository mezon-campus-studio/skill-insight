
import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';

import { ClassService } from '../../../../services/class.service';

@Component({
  selector: 'app-my-classes',

  standalone: true,

  imports: [
    CommonModule,
    RouterModule
  ],

  templateUrl: './my-classes.html',

  styleUrl: './my-classes.css'
})
export class MyClassesComponent implements OnInit {

  loading = false;

  myClasses: any[] = [];

  constructor(
    private classService: ClassService
  ) {}

  ngOnInit(): void {
    this.loadMyClasses();
  }

  loadMyClasses(): void {

    this.loading = true;

    this.classService
      .getMyClasses()
      .subscribe({

        next: (res: any) => {

          this.loading = false;

          console.log(res);

          this.myClasses =
            Array.isArray(res)
              ? res
              : res.data ?? [];

        },

        error: (err: any) => {

          this.loading = false;

          console.error(err);

        }

      });

  }

}