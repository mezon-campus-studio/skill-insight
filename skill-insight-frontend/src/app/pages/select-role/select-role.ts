import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { finalize } from 'rxjs';

@Component({
  selector: 'app-select-role',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './select-role.html',
  styleUrls: ['./select-role.css'],
})
export class SelectRoleComponent implements OnInit {
  user: any = null;
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    const user = this.auth.getUser();

    if (!user) {
      this.router.navigate(['/login']);
      return;
    }

    this.user = {
      ...user,
      user_id: user.user_id || user.userId,
    };
  }

  selectRole(role: 'teacher' | 'student') {
    if (!this.user || this.loading) return;

    this.loading = true;
    const payload = {
      userId: this.user.user_id,
      role: role,
    };

    this.auth
      .updateRole(payload)
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (res: any) => {
          const updatedUser = { ...this.user, role: role };
          this.auth.saveUser(updatedUser);

          //this.router.navigate(['/dashboard']);
          this.router.navigate(['/subject']);
        },
        error: (err) => {
          alert(err?.error?.message || 'Không thể cập nhật vai trò, vui lòng thử lại');
        },
      });
  }

  logout() {
    this.auth.logout();
  }
}
