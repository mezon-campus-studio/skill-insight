import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class Users implements OnInit {

  users: any[] = [];

  currentPage = 1;
  totalPages = 1;
  limit = 25;

  loading = false;

  savingMap: { [key: number]: boolean } = {};

  constructor(
    private userService: UserService
  ) {}

  // ======================
  // INIT
  // ======================
  ngOnInit(): void {
    this.loadUsers(1);
  }

  // ======================
  // LOAD USERS
  // ======================
  loadUsers(page: number = 1): void {

    if (this.loading) return;

    this.loading = true;

    this.userService
      .getUsers(page, this.limit)
      .subscribe({
        next: (res: any) => {

          const data = res?.data || {};

          this.users = data.users || [];

          this.currentPage =
            data.pagination?.currentPage || 1;

          this.totalPages =
            data.pagination?.totalPages || 1;

          this.loading = false;
        },

        error: (err) => {
          console.error('LOAD USERS ERROR:', err);
          this.users = [];
          this.loading = false;
        }
      });
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

  // ======================
  // NEXT / PREV (chuẩn UX)
  // ======================
  nextPage() {
    this.changePage(this.currentPage + 1);
  }

  prevPage() {
    this.changePage(this.currentPage - 1);
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

          console.log('✔ Updated:', user);

          // reload page hiện tại
          this.loadUsers(this.currentPage);

          this.savingMap[id] = false;
        },

        error: (err) => {
          console.error('UPDATE ROLE ERROR:', err);
          alert('Lỗi cập nhật');

          this.savingMap[id] = false;
        }
      });
  }

  // ======================
  // HELPER UI
  // ======================
  isSaving(userId: number): boolean {
    return !!this.savingMap[userId];
  }

}