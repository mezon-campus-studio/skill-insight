import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { HttpErrorResponse } from '@angular/common/http';

import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit {

  users: any[] = [];

  currentPage = 1;
  totalPages = 1;
  limit = 5;

  loading = false;

  savingMap: { [key: number]: boolean } = {};

  // ======================
  // 🔍 SEARCH
  // ======================
  searchKeyword: string = '';

  // ======================
  // CREATE USER
  // ======================
  newUser = {
    full_name: '',
    email: '',
    password: '',
    role: 'student'
  };

  creating = false;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  // ======================
  // INIT
  // ======================
  ngOnInit(): void {
    this.loadUsers(1);
  }

  // ======================
  // LOAD USERS (CÓ SEARCH)
  // ======================
  loadUsers(page: number = 1): void {

    this.loading = true;
    this.users = [];

    this.userService
      .getUsers(page, this.limit, this.searchKeyword) // 🔥 truyền keyword
      .subscribe({
        next: (res: any) => {

          const data = res?.data || {};

          this.users = [...(data.users || [])];

          this.currentPage =
            data.pagination?.currentPage || 1;

          this.totalPages =
            data.pagination?.totalPages || 1;

          this.loading = false;

          this.cdr.detectChanges();
        },

        error: (err: HttpErrorResponse) => {
          console.error('LOAD USERS ERROR:', err.message);

          this.users = [];
          this.loading = false;

          this.cdr.detectChanges();
        }
      });
  }

  // ======================
  // 🔍 SEARCH ACTION
  // ======================
  onSearch(): void {
    this.loadUsers(1); // luôn quay về page 1 khi search
  }

  // ======================
  // PAGINATION
  // ======================
  changePage(page: number): void {
    if (
      page < 1 ||
      page > this.totalPages ||
      page === this.currentPage
    ) {
      return;
    }

    this.loadUsers(page);
  }

  nextPage(): void {
    this.changePage(this.currentPage + 1);
  }

  prevPage(): void {
    this.changePage(this.currentPage - 1);
  }

  // ======================
  // CREATE USER
  // ======================
  createUser(): void {

    if (this.creating) return;

    if (
      !this.newUser.full_name ||
      !this.newUser.email ||
      !this.newUser.password
    ) {
      alert('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    this.creating = true;

    this.userService
      .createUser(this.newUser)
      .subscribe({
        next: () => {

          alert('Tạo user thành công');

          this.newUser = {
            full_name: '',
            email: '',
            password: '',
            role: 'student'
          };

          this.loadUsers(1);

          this.creating = false;
        },

        error: (err: HttpErrorResponse) => {
          console.error('CREATE USER ERROR:', err.message);

          alert(err.error?.message || 'Tạo user thất bại');

          this.creating = false;
        }
      });
  }

  // ======================
  // UPDATE ROLE
  // ======================
  saveRole(user: any): void {
    const id = user.user_id;

    if (this.savingMap[id]) return;

    this.savingMap[id] = true;

    this.userService
      .updateRole(user.user_id, user.role)
      .subscribe({
        next: () => {
          alert('Cập nhật quyền thành công');

          this.loadUsers(this.currentPage);

          this.savingMap[id] = false;
        },

        error: (err: HttpErrorResponse) => {
          console.error('UPDATE ROLE ERROR:', err.message);

          alert(err.error?.message || 'Lỗi cập nhật quyền');

          this.savingMap[id] = false;
        }
      });
  }

  // ======================
  // DELETE USER
  // ======================
  deleteUser(user: any): void {

    const confirmDelete = confirm(
      `Bạn có chắc muốn xóa user "${user.full_name}"?`
    );

    if (!confirmDelete) return;

    this.userService
      .deleteUser(user.user_id)
      .subscribe({
        next: () => {
          alert('Xóa user thành công');

          this.loadUsers(this.currentPage);
        },

        error: (err: HttpErrorResponse) => {
          console.error('DELETE USER ERROR:', err.message);

          alert(err.error?.message || 'Xóa user thất bại');
        }
      });
  }

  // ======================
  // HELPER UI
  // ======================
  isSaving(userId: number): boolean {
    return !!this.savingMap[userId];
  }

  // ======================
  // PAGINATION ARRAY
  // ======================
  get pages(): number[] {
    return Array.from(
      { length: this.totalPages },
      (_, i) => i + 1
    );
  }
}