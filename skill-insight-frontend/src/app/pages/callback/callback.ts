import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center">
      <div class="text-center">
        <p class="text-lg">Đang xác thực tài khoản...</p>
        <p class="text-sm text-gray-500">Vui lòng đợi trong giây lát</p>
      </div>
    </div>
  `,
})
export class CallbackComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {
    console.log('CALLBACK PAGE');

    const token = this.route.snapshot.queryParamMap.get('token');
    const needSetPassword = this.route.snapshot.queryParamMap.get('needSetPassword');

    if (!token) {
      console.error('Không có token');
      this.router.navigate(['/login']);
      return;
    }

    localStorage.setItem('accessToken', token);
    console.log('Token saved:', token);

    setTimeout(() => {
      this.tryGetMe(0, needSetPassword);
    }, 0);
  }

  tryGetMe(attempt: number, needSetPassword: string | null) {
    this.auth.getMe().subscribe({
      next: (res: any) => {
        console.log('User:', res);

        if (res?.user) {
          this.auth.saveUser(res.user);

          this.ngZone.run(() => {
            if (needSetPassword === 'true' || res.user.hasPassword === false) {
              this.router.navigate(['/set-password'], { replaceUrl: true });
              return;
            }

            if (!res.user.role) {
              this.router.navigate(['/select-role'], { replaceUrl: true });
              return;
            }

            this.router.navigate(['/dashboard'], { replaceUrl: true });
          });
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        console.error(`Lỗi lần ${attempt + 1}`, err);

        if (err.status === 401 || attempt >= 2) {
          localStorage.removeItem('accessToken'); 
          this.router.navigate(['/login']);
        } else {
          setTimeout(() => this.tryGetMe(attempt + 1, needSetPassword), 1000);
        }
      }
    });
  }
}