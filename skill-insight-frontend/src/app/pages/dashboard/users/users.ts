import {
  Component,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';

import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './users.html',
  styleUrls: ['./users.css']
})
export class UsersComponent implements OnInit {

  users: any[] = [];

  currentPage = 1;
  totalPages = 1;
  limit = 5;

  loading = false;

  savingMap: { [key: number]: boolean } = {};

  searchKeyword: string = '';

  newUser = {
    full_name: '',
    email: '',
    password: '',
    role: 'student'
  };

  creating = false;

  constructor(
    private userService: UserService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers(1);
  }

  loadUsers(page: number = 1): void {

    this.loading = true;

    this.userService
      .getUsers(page, this.limit, this.searchKeyword)
      .subscribe({
        next: (res: any) => {

          console.log("📦 USERS RESPONSE:", res);

          const data = res?.data || {};

          this.users = data.users || [];

          this.currentPage =
            data.pagination?.currentPage || 1;

          this.totalPages =
            data.pagination?.totalPages || 1;

          this.loading = false;
        },

        error: (err: HttpErrorResponse) => {
          console.error('LOAD USERS ERROR:', err);

          this.loading = false;
          this.users = [];

          if (err.status === 401) {
            this.router.navigate(['/login']);
          }
        }
      });
  }

  onSearch(): void {
    this.loadUsers(1);
  }

  changePage(page: number): void {
    if (
      page < 1 ||
      page > this.totalPages ||
      page === this.currentPage
    ) return;

    this.loadUsers(page);
  }

  nextPage(): void {
    this.changePage(this.currentPage + 1);
  }

  prevPage(): void {
    this.changePage(this.currentPage - 1);
  }

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
          console.error('CREATE USER ERROR:', err);

          alert(err.error?.message || 'Tạo user thất bại');

          this.creating = false;
        }
      });
  }

  saveRole(user: any): void {

    const id = user.user_id;

    if (this.savingMap[id]) return;

    this.savingMap[id] = true;

    this.userService
      .updateRole(id, user.role)
      .subscribe({
        next: () => {
          alert('Cập nhật quyền thành công');

          this.loadUsers(this.currentPage);

          this.savingMap[id] = false;
        },

        error: (err: HttpErrorResponse) => {
          console.error('UPDATE ROLE ERROR:', err);

          alert(err.error?.message || 'Lỗi cập nhật quyền');

          this.savingMap[id] = false;
        }
      });
  }

  deleteUser(user: any): void {

    const id = user.user_id;

    const confirmDelete = confirm(
      `Bạn có chắc muốn xóa user "${user.full_name}"?`
    );

    if (!confirmDelete) return;

    this.userService
      .deleteUser(id)
      .subscribe({
        next: () => {
          alert('Xóa user thành công');

          this.loadUsers(this.currentPage);
        },

        error: (err: HttpErrorResponse) => {
          console.error('DELETE USER ERROR:', err);

          alert(err.error?.message || 'Xóa user thất bại');
        }
      });
  }

  // ======================
  // HELPER
  // ======================
  isSaving(userId: number): boolean {
    return !!this.savingMap[userId];
  }

  get pages(): number[] {
    return Array.from(
      { length: this.totalPages },
      (_, i) => i + 1
    );
  }
}