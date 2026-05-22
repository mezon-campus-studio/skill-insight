import { Component, OnInit, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50">
      <div class="text-center p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p class="text-xl font-semibold text-gray-800 italic uppercase tracking-tighter">Đang xác thực tài khoản</p>
        <p class="text-sm text-gray-400 mt-2 font-medium">Hệ thống đang kết nối, vui lòng đợi trong giây lát</p>
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

  // ngOnInit(): void {
  //   console.log('--- [STEP 1] XỬ LÝ CALLBACK ---');

  //   this.route.queryParams.subscribe(params => {
  //     const rawToken = params['token'];
  //     const needSetPassword = params['needSetPassword'];

  //     if (!rawToken) {
  //       console.error('--- [LỖI] KHÔNG CÓ TOKEN ---');
  //       this.router.navigate(['/login']);
  //       return;
  //     }

  //     try {
  //       const token = decodeURIComponent(rawToken);
  //       localStorage.setItem('accessToken', token);
  //       console.log('--- [STEP 2] ĐÃ LƯU TOKEN ---');

  //       // Gọi API lấy info ngay
  //       this.tryGetMe(0, needSetPassword);

  //     } catch (err) {
  //       console.error('--- [LỖI] TOKEN HỎNG ---');
  //       this.router.navigate(['/login']);
  //     }
  //   });
  // }

ngOnInit(): void {
  console.log('FULL URL:', window.location.href);

  this.route.queryParams.subscribe(params => {
    console.log('QUERY PARAMS:', params);

    const rawToken = params['token'];
    const needSetPassword = params['needSetPassword'];

    console.log('TOKEN:', rawToken);

    if (!rawToken) {
      console.error('KHÔNG NHẬN ĐƯỢC TOKEN');
      return;
    }

    localStorage.setItem('accessToken', rawToken);

    console.log('TOKEN ĐÃ LƯU:', localStorage.getItem('accessToken'));

    this.tryGetMe(0, needSetPassword);
  });
}

  tryGetMe(attempt: number, needSetPassword: string | null) {
    this.auth.getMe().subscribe({
      next: (res: any) => {
        if (res?.user) {
          this.auth.saveUser(res.user);

          this.ngZone.run(() => {
            /** 
             * 🔥 QUAN TRỌNG: 
             * Vì set-password nằm trong Dashboard Layout, bạn PHẢI đi qua 
             * đường dẫn đầy đủ: /dashboard/set-password
             */
            
            if (needSetPassword === 'true' || res.user.hasPassword === false) {
              console.log('--- [REDIRECT] ĐI TỚI: Dashboard -> Set Password ---');
              this.router.navigate(['/dashboard/set-password'], { replaceUrl: true });
              return;
            }

            if (!res.user.role) {
              console.log('--- [REDIRECT] ĐI TỚI: Select Role ---');
              this.router.navigate(['/select-role'], { replaceUrl: true });
              return;
            }

            console.log('--- [REDIRECT] ĐI TỚI: Dashboard Overview ---');
            this.router.navigate(['/dashboard/overview'], { replaceUrl: true });
          });
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: (err) => {
        console.error(`--- [LỖI API] LẦN ${attempt + 1} ---`, err);
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
