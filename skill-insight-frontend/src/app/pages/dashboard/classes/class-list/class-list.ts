import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import {
  RouterModule
} from '@angular/router';

import {
  ClassService
} from '../../../../services/class.service';

@Component({
  selector: 'app-class-list',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],

  templateUrl: './class-list.html',

  styleUrl: './class-list.css',
})
export class ClassList implements OnInit {

  // =========================
  // DATA
  // =========================
  classes: any[] = [];

  filteredClasses: any[] = [];

  paginatedClasses: any[] = [];

  // =========================
  // FILTER
  // =========================
  searchText = '';

  // =========================
  // CHECKBOX
  // =========================
  selectedClassIds: Set<number> =
    new Set();

  selectAll = false;

  // =========================
  // PAGINATION
  // =========================
  currentPage = 1;

  itemsPerPage = 6;

  totalPages = 1;

  // =========================
  // UI
  // =========================
  loading = false;

  // =========================
  // TEACHER
  // =========================
  currentTeacherId = 1;

  // =========================
  // CONSTRUCTOR
  // =========================
  constructor(
    private classService: ClassService
  ) {}

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {

    this.loadClasses();
  }

  // =========================
  // LOAD CLASSES
  // =========================
  loadClasses(): void {

    this.loading = true;

    this.classService
      .getClasses()
      .subscribe({

        next: (res: any) => {

          this.loading = false;

          console.log(
            'CLASSES:',
            res
          );

          const allClasses =
            res?.data || [];

          // =================================
          // CHỈ HIỆN LỚP CỦA GIÁO VIÊN
          // =================================
          this.classes =
            allClasses.filter(
              (c: any) =>
                Number(
                  c.teacher_id
                ) ===
                this.currentTeacherId
            );

          this.applyFilter();
        },

        error: (err: any) => {

          this.loading = false;

          console.error(
            'Load classes failed',
            err
          );
        }
      });
  }

  // =========================
  // FILTER
  // =========================
  applyFilter(): void {

    let data = [...this.classes];

    // =========================
    // SEARCH
    // =========================
    if (
      this.searchText.trim()
    ) {

      const keyword =
        this.searchText
          .toLowerCase();

      data = data.filter(
        c =>

          (c.class_name || '')
            .toLowerCase()
            .includes(keyword)

          ||

          (c.class_code || '')
            .toLowerCase()
            .includes(keyword)
      );
    }

    this.filteredClasses = data;

    this.resetPagination();
  }

  // =========================
  // PAGINATION
  // =========================
  resetPagination(): void {

    this.totalPages = Math.max(
      1,
      Math.ceil(
        this.filteredClasses.length
        / this.itemsPerPage
      )
    );

    this.currentPage = 1;

    this.updatePagination();
  }

  updatePagination(): void {

    const start =
      (this.currentPage - 1)
      * this.itemsPerPage;

    const end =
      start + this.itemsPerPage;

    this.paginatedClasses =
      this.filteredClasses.slice(
        start,
        end
      );
  }

  goToPage(page: number): void {

    if (
      page < 1
      ||
      page > this.totalPages
    ) {
      return;
    }

    this.currentPage = page;

    this.updatePagination();
  }

  // =========================
  // CHECKBOX
  // =========================
  toggleSelectAll(): void {

    if (this.selectAll) {

      this.filteredClasses
        .forEach(c => {

          this.selectedClassIds
            .add(c.class_id);
        });

    } else {

      this.selectedClassIds
        .clear();
    }
  }

  toggleClass(id: number): void {

    if (
      this.selectedClassIds
        .has(id)
    ) {

      this.selectedClassIds
        .delete(id);

    } else {

      this.selectedClassIds
        .add(id);
    }
  }

  // =========================
  // DELETE ONE
  // =========================
  deleteClass(id: number): void {

    if (
      !confirm(
        'Xóa lớp học này?'
      )
    ) {
      return;
    }

    this.classService
      .deleteClass(id)
      .subscribe({

        next: () => {

          this.classes =
            this.classes.filter(
              c =>
                c.class_id !== id
            );

          this.applyFilter();
        },

        error: (err: any) => {

          console.error(
            'Delete failed',
            err
          );
        }
      });
  }

  // =========================
  // DELETE SELECTED
  // =========================
  deleteSelected(): void {

    if (
      this.selectedClassIds.size
      === 0
    ) {
      return;
    }

    if (
      !confirm(
        'Xóa các lớp đã chọn?'
      )
    ) {
      return;
    }

    const ids =
      Array.from(
        this.selectedClassIds
      );

    this.classService
      .deleteManyClasses(ids)
      .subscribe({

        next: () => {

          this.classes =
            this.classes.filter(
              c =>
                !this
                  .selectedClassIds
                  .has(c.class_id)
            );

          this.selectedClassIds
            .clear();

          this.applyFilter();
        },

        error: (err: any) => {

          console.error(
            'Delete selected failed',
            err
          );
        }
      });
  }

  // =========================
  // EMPTY
  // =========================
  get isEmpty(): boolean {

    return (
      this.filteredClasses.length
      === 0
    );
  }

  // =========================
  // STUDENT COUNT
  // =========================
  getStudentCount(
    classItem: any
  ): number {

    return (
      classItem?._count
        ?.students || 0
    );
  }

  // =========================
  // ASSIGNMENT COUNT
  // =========================
  getAssignmentCount(
    classItem: any
  ): number {

    return (
      classItem?._count
        ?.assignments || 0
    );
  }

  // =========================
  // STATUS LABEL
  // =========================
  getStatusLabel(
    classItem: any
  ): string {

    return classItem?.is_active
      ? 'Đang hoạt động'
      : 'Đã khóa';
  }

  // =========================
  // STATUS CLASS
  // =========================
  getStatusClass(
    classItem: any
  ): string {

    return classItem?.is_active
      ? 'bg-green-100 text-green-700'
      : 'bg-gray-200 text-gray-700';
  }
}