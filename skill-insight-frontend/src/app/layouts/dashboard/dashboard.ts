<<<<<<< HEAD
import {
  Component,
  OnInit,
  HostListener,
  ChangeDetectorRef,
  signal,
  computed,
  inject
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

// =========================
// INTERFACE
// =========================
interface MenuItem {
  path: string;
  label: string;
  badge?: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule
  ],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  // =========================
  // INJECT
  // =========================
  private auth = inject(AuthService);

  private router = inject(Router);

  private cdr = inject(ChangeDetectorRef);

  // =========================
  // SIGNALS
  // =========================
  user = signal<any>(null);

  isCollapsed = signal(false);

  showMenu = signal(false);

  showSetPasswordPopup = signal(false);

  showLogoutPopup = signal(false);

  // =========================
  // MENU ROLE
  // =========================
  menuItems = computed<MenuItem[]>(() => {

  const role =
    this.user()?.role?.toLowerCase();

  // =========================
  // COMMON
  // =========================

  const commonMenu: MenuItem[] = [

    {
      path: 'overview',
      label: 'Tổng quan'
    }

  ];

  // =====================================================
  // ADMIN
  // =====================================================

  if (role === 'admin') {

    return [

      ...commonMenu,

      {
        path: 'users',
        label: 'Người dùng'
      },

      {
        path: 'subjects',
        label: 'Môn học'
      },

      {
        path: 'topics',
        label: 'Chủ đề'
      },

      {
        path: 'question-batches',
        label: 'Ngân hàng câu hỏi'
      },

      {
        path: 'system-statistics',
        label: 'Thống kê hệ thống'
      },

      {
        path: 'system-settings',
        label: 'Cài đặt hệ thống'
      },

      {
        path: 'notifications',
        label: 'Thông báo'
      }

    ];

  }

  // =====================================================
  // TEACHER
  // =====================================================

  if (role === 'teacher') {

    return [

      ...commonMenu,

      {
        path: 'classes',
        label: 'Lớp học'
      },

      {
        path: 'materials',
        label: 'Tài liệu giảng dạy'
      },

      {
        path: 'exams',
        label: 'Kho đề'
      },

      {
        path: 'assignments',
        label: 'Giao bài kiểm tra'
      },

      {
        path: 'student-results',
        label: 'Kết quả học sinh'
      },

      {
        path: 'student-analysis',
        label: 'Phân tích học sinh'
      },

      {
        path: 'teacher-ai',
        label: 'AI hỗ trợ giảng dạy'
      },

      {
        path: 'notifications',
        label: 'Thông báo'
      }

    ];

  }

  // =====================================================
  // STUDENT
  // =====================================================

  if (role === 'student') {

    return [

      ...commonMenu,

      {
        path: 'my-classes',
        label: 'Lớp học của tôi'
      },

      {
        path: 'learning-materials',
        label: 'Tài liệu học tập'
      },

      {
        path: 'my-exams',
        label: 'Bài kiểm tra'
      },

      {
        path: 'practice',
        label: 'Luyện tập AI'
      },

      {
        path: 'learning-results',
        label: 'Kết quả học tập'
      },

      {
        path: 'ai-learning',
        label: 'AI hỗ trợ học tập'
      },

      {
        path: 'notifications',
        label: 'Thông báo'
      }

    ];

  }

  return commonMenu;

});

  // =========================
  // CLASS DETAIL TABS
  // =========================
  classDetailTabs = computed<MenuItem[]>(() => {

    const role =
      this.user()?.role?.toLowerCase();

    const commonTabs: MenuItem[] = [

      {
        path: 'stream',
        label: 'Bảng tin'
      },

      {
        path: 'materials',
        label: 'Tài liệu'
      },

      {
        path: 'exams',
        label: 'Bài kiểm tra'
      },

      {
        path: 'members',
        label: 'Thành viên'
      },

      {
        path: 'discussion',
        label: 'Thảo luận'
      },

      {
        path: 'scores',
        label: 'Điểm số'
      }
    ];

    // =========================
    // TEACHER TAB
    // =========================
    if (role === 'teacher') {

      return [

        ...commonTabs,

        {
          path: 'analytics',
          label: 'Phân tích lớp'
        }
      ];
    }

    return commonTabs;
  });

  // =========================
  // INIT
  // =========================
  ngOnInit(): void {

    const localUser =
      this.auth.getUser();

    if (localUser) {

      this.user.set(localUser);
    }

    this.syncUser();

    this.router.events
      .pipe(
        filter(
          event =>
            event instanceof NavigationEnd
        )
      )
      .subscribe((event: any) => {

        if (
          event.url.includes('set-password')
        ) {

          this.showSetPasswordPopup.set(false);

          return;
        }

        const currentUser =
          this.auth.getUser();

        if (currentUser) {

          this.user.set(currentUser);
        }
      });
  }

  // =========================
  // SYNC USER
  // =========================
  private syncUser(): void {

    this.auth.getMe().subscribe({

      next: (res: any) => {

        const userData = res?.user;

        if (!userData) {

          this.router.navigate(['/login']);

          return;
        }

        this.user.set(userData);

        this.auth.saveUser(userData);

        const isAtSetPasswordPage =
          this.router.url.includes(
            'set-password'
          );

        if (
          res.needSetPassword === true &&
          !isAtSetPasswordPage
        ) {

          this.showSetPasswordPopup.set(true);

        } else {

          this.showSetPasswordPopup.set(false);
        }

        this.cdr.detectChanges();
      },

      error: () => {

        this.auth.clearUser();

        this.router.navigate(['/login']);
      }
    });
  }

  // =========================
  // SIDEBAR
  // =========================
  toggleSidebar(): void {

    this.isCollapsed.update(v => !v);
  }

  // =========================
  // DROPDOWN
  // =========================
  toggleMenu(event: Event): void {

    event.stopPropagation();

    this.showMenu.update(v => !v);
  }

  @HostListener('document:click')
  closeMenu(): void {

    this.showMenu.set(false);
  }

  // =========================
  // PASSWORD
  // =========================
  goSetPassword(): void {

    this.showSetPasswordPopup.set(false);

    this.cdr.detectChanges();

    this.router.navigate([
      '/dashboard/set-password'
    ]);
  }

  skipSetPassword(): void {

    this.showSetPasswordPopup.set(false);
  }

  // =========================
  // PROFILE
  // =========================
  goProfile(): void {

    this.router.navigate([
      '/dashboard/profile'
    ]);

    this.showMenu.set(false);
  }

  // =========================
  // CHANGE PASSWORD
  // =========================
  goChangePassword(): void {

    const path =
      this.user()?.hasPassword
        ? '/dashboard/change-password'
        : '/dashboard/set-password';

    this.router.navigate([path]);

    this.showMenu.set(false);
  }

  // =========================
  // LOGOUT
  // =========================
  logout(): void {

    this.showLogoutPopup.set(true);
  }

  cancelLogout(): void {

    this.showLogoutPopup.set(false);
  }

  executeLogout(): void {

    this.showLogoutPopup.set(false);

    this.auth.logout().subscribe({

      next: () => {

        this.auth.clearUser();

        this.router.navigate(
          ['/login'],
          {
            replaceUrl: true
          }
        );
      },

      error: () => {

        this.auth.clearUser();

        this.router.navigate(
          ['/login'],
          {
            replaceUrl: true
          }
        );
      }
    });
  }

  // =========================
  // ROLE LABEL
  // =========================
  getRoleLabel(role: string): string {

    const roles: any = {

      admin: '● Quản trị viên',

      teacher: '● Giáo viên',

      student: '● Học sinh'
    };

    return (
      roles[role?.toLowerCase()] ||
      '● Thành viên'
    );
  }

  // =========================
  // SAMPLE FEED
  // =========================
  getSampleClassFeed() {

    return [

      {
        type: 'announcement',
        teacher: 'Nguyễn Văn A',
        content:
          'Ngày mai kiểm tra chương 3.',
        comments: 12,
        createdAt: '2 giờ trước'
      },

      {
        type: 'exam',
        teacher: 'Nguyễn Văn A',
        content:
          'Đã đăng bài kiểm tra giữa kỳ.',
        comments: 5,
        createdAt: 'Hôm nay'
      },

      {
        type: 'material',
        teacher: 'Nguyễn Văn A',
        content:
          'Đã thêm tài liệu ôn tập PDF.',
        comments: 3,
        createdAt: 'Hôm qua'
      }
    ];
  }
=======
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
>>>>>>> 7831c51b0f00e6b70f4c2d7230e7bc7f04f9e0b5
}