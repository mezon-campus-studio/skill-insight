import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { Router } from '@angular/router';

import { ClassService } from '../../../../services/class.service';

@Component({
  selector: 'app-join-class',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './join-class.html',

  styleUrl: './join-class.css'
})
export class JoinClassComponent {

  classCode = '';

  loading = false;

  constructor(
    private classService: ClassService,
    private router: Router
  ) {}

  joinClass(): void {

    if (!this.classCode.trim()) {

      alert('Vui lòng nhập mã lớp');

      return;
    }

    this.loading = true;

    this.classService
      .joinClass(this.classCode)
      .subscribe({

        next: (res: any) => {

        this.loading = false;

        alert(res.message || 'Tham gia lớp thành công');

        this.router.navigate([
          '/dashboard/my-classes',
          res.data.class_id
        ]);

      },

        error: (err: any) => {

          this.loading = false;

          alert(
            err?.error?.message ||
            'Không thể tham gia lớp'
          );

        }

      });

  }

}