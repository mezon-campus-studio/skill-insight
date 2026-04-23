import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-select-role',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './select-role.html',
  styleUrls: ['./select-role.css']
})
export class SelectRoleComponent {

  loading = false;

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  selectRole(role: string) {

    // tránh spam click
    if (this.loading) return;

    this.loading = true;

    console.log('CLICK ROLE:', role);

    this.auth.updateRole(role).subscribe({
      next: (res: any) => {

        console.log('UPDATE ROLE SUCCESS:', res);

        const user = this.auth.getUser();

        if (user) {
          user.role = role;

          this.auth.saveAuth({
            token: this.auth.getToken(),
            user
          });
        }

        this.router.navigate(['/dashboard']);
      },

      error: (err) => {
        console.error('UPDATE ROLE ERROR:', err);
        alert('Lỗi cập nhật role');
        this.loading = false;
      }
    });
  }
}