import {
  Component,
  OnInit,
  HostListener,
  ChangeDetectorRef,
  signal,
  computed
} from '@angular/core';
import {
  Router,
  RouterOutlet,
  RouterModule,
  NavigationEnd,
  ActivatedRoute
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  user = signal<any>(null);

  isCollapsed = false;
  showMenu = false;

  showSetPasswordPopup = false;
  showLogoutPopup = false;

  constructor(
    public router: Router,
    private route: ActivatedRoute,
    private auth: AuthService,
    private cdr: ChangeDetectorRef
  ) {}

  menuItems = computed(() => {
    const role = this.user()?.role;

    const commonMenu = [
      { path: 'overview', label: 'Tổng quan' },
      { path: 'profile', label: 'Cá nhân' }
    ];

    if (role === 'admin') {
      return [
        ...commonMenu,
        { path: 'users', label: 'Quản lý người dùng' },
        { path: 'courses', label: 'Khóa học' },
        { path: 'questions', label: 'Ngân hàng câu hỏi' }
      ];
    }

    if (role === 'teacher') {
      return [
        ...commonMenu,
        { path: 'classes', label: 'Lớp học' },
        { path: 'exams', label: 'Đề thi' },
        { path: 'assign', label: 'Giao bài' },
        { path: 'questions', label: 'Ngân hàng câu hỏi' }
      ];
    }

    if (role === 'student') {
      return [
        ...commonMenu,
        { path: 'my-classes', label: 'Lớp học của tôi' },
        { path: 'practice', label: 'Luyện tập' }
      ];
    }

    return commonMenu;
  });

  ngOnInit(): void {
   
    const localUser = this.auth.getUser();
    if (localUser) {
      this.user.set(localUser);
    }

    this.syncUser();

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.user.set(this.auth.getUser());
      });

    this.route.queryParams.subscribe(params => {
      if (params['showSetPassword'] === 'true') {
        this.showSetPasswordPopup = true;
      }
    });
  }

  private syncUser() {
    this.auth.getMe().subscribe({
      next: (res: any) => {
        const userData = res?.user;

        if (!userData) {
          this.router.navigate(['/login']);
          return;
        }

        this.user.set(userData);
        this.auth.saveUser(userData);

        if (!userData.role) {
          this.router.navigate(['/select-role']);
        }

        if (userData.hasPassword === false) {
          this.showSetPasswordPopup = true;
        }

        this.cdr.detectChanges();
      },
      error: () => {
        this.auth.clearUser();
        this.router.navigate(['/login']);
      }
    });
  }

  toggleSidebar() {
    this.isCollapsed = !this.isCollapsed;
  }

  toggleMenu(event: Event) {
    event.stopPropagation();
    this.showMenu = !this.showMenu;
  }

  @HostListener('document:click')
  closeMenu() {
    this.showMenu = false;
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: any) {
    const target = event.target;

    if (target?.classList?.contains('backdrop-blur-sm')) {
      this.showLogoutPopup = false;
    }
  }

  isRouteActive(path: string): boolean {
    return this.router.url.includes(path);
  }

  logout() {
    this.showLogoutPopup = true;
  }

  executeLogout() {
    this.showLogoutPopup = false;
    this.auth.logout();
  }

  cancelLogout() {
    this.showLogoutPopup = false;
  }

  deleteAccount() {
    if (confirm('Bạn chắc chắn muốn xoá tài khoản?')) {
      this.auth.deleteAccount().subscribe({
        next: () => {
          alert('Đã xoá tài khoản');
          this.auth.clearUser();
          this.router.navigate(['/login']);
        },
        error: () => alert('Không thể xoá tài khoản')
      });
    }
  }

  goChangePassword() {
    const user = this.user();
    const path = user?.hasPassword
      ? '/dashboard/change-password'
      : '/dashboard/set-password';

    this.router.navigate([path]);
    this.showMenu = false;
  }

  skipSetPassword() {
    this.showSetPasswordPopup = false;
  }

  goSetPassword() {
    this.showSetPasswordPopup = false;
    this.router.navigate(['/dashboard/set-password']);
  }

  navigate(path: string) {
    this.router.navigate([`/dashboard/${path}`]);
    this.showMenu = false;
  }
}