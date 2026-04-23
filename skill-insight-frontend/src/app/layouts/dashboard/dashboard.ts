import {
  Component,
  OnInit,
  HostListener
} from '@angular/core';

import {
  Router,
  RouterOutlet,
  RouterModule,
  NavigationEnd
} from '@angular/router';

import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  user: any = null;
  isCollapsed = false;
  showMenu = false;

  constructor(
    public router: Router,
    private auth: AuthService
  ) {}

  // ======================
  // INIT
  // ======================
  ngOnInit(): void {

    this.user = this.auth.getUser();

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        this.user = this.auth.getUser();
      });
  }

  // ======================
  // SIDEBAR
  // ======================
  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  // ======================
  // DROPDOWN
  // ======================
  toggleMenu(event: Event) {
    event.stopPropagation();
    this.showMenu = !this.showMenu;
  }

  // click ngoài → đóng dropdown
  @HostListener('document:click')
  closeMenu() {
    this.showMenu = false;
  }

  // ======================
  // SWITCH ROLE
  // ======================
  switchRole(role: string) {

    if (!this.user) return;

    if (this.user.role === 'admin') return;

    this.auth.updateRole(role).subscribe({
      next: () => {

        this.user.role = role;

        this.auth.saveAuth({
          token: this.auth.getToken(),
          user: this.user
        });

        // reload UI nhẹ
        this.router.navigate(['/dashboard']);
      },
      error: () => alert('Không thể đổi role')
    });
  }

  goDashboard() {
    this.router.navigate(['/dashboard']);
  }

  goUsers() {
    this.router.navigate(['/dashboard/users']);
  }

  goCourses() {
    this.router.navigate(['/dashboard/courses']);
  }

  goAssignments() {
    this.router.navigate(['/dashboard/assignments']);
  }

  // ======================
  // PROFILE
  // ======================
  goProfile() {
    alert('Trang profile (chưa làm)');
  }

  // ======================
  // LOGOUT
  // ======================
  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}