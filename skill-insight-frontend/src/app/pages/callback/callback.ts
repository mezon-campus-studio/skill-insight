// import { Component, OnInit, NgZone } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { ActivatedRoute, Router } from '@angular/router';
// import { AuthService } from '../../services/auth.service';

// @Component({
//   selector: 'app-callback',
//   standalone: true,
//   imports: [CommonModule],
//   template: `
//     <div class="min-h-screen flex items-center justify-center bg-gray-50">
//       <div class="text-center p-8 bg-white shadow-xl rounded-2xl border border-gray-100">
//         <div
//           class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4">
//         </div>

//         <p class="text-xl font-semibold text-gray-800 italic uppercase tracking-tighter">
//           Đang xác thực tài khoản
//         </p>

//         <p class="text-sm text-gray-400 mt-2 font-medium">
//           Hệ thống đang kết nối, vui lòng đợi trong giây lát
//         </p>
//       </div>
//     </div>
//   `
// })
// export class CallbackComponent implements OnInit {

//   constructor(
//     private route: ActivatedRoute,
//     private router: Router,
//     private auth: AuthService,
//     private ngZone: NgZone
//   ) {}

//   ngOnInit(): void {

//     this.route.queryParams.subscribe(params => {

//       const token = params['token'];

//       if (!token) {
//         this.router.navigate(['/login']);
//         return;
//       }

//       localStorage.setItem('accessToken', decodeURIComponent(token));

//       this.tryGetMe(0);

//     });

//   }

//   private tryGetMe(attempt: number): void {

//     this.auth.getMe().subscribe({

//       next: (res: any) => {

//         if (!res?.user) {
//           this.router.navigate(['/login']);
//           return;
//         }

//         this.auth.saveUser(res.user);

//         this.ngZone.run(() => {

//           /**
//            * Chỉ dựa vào needSetPassword
//            * KHÔNG kiểm tra hasPassword nữa
//            */
//           if (res.needSetPassword === true) {

//             this.router.navigate(
//               ['/dashboard/set-password'],
//               {
//                 replaceUrl: true
//               }
//             );

//             return;
//           }

//           if (!res.user.role) {

//             this.router.navigate(
//               ['/select-role'],
//               {
//                 replaceUrl: true
//               }
//             );

//             return;
//           }

//           this.router.navigate(
//             ['/dashboard/overview'],
//             {
//               replaceUrl: true
//             }
//           );

//         });

//       },

//       error: (err) => {

//         if (err.status === 401 || attempt >= 2) {

//           localStorage.removeItem('accessToken');

//           this.router.navigate(['/login']);

//           return;
//         }

//         setTimeout(() => {

//           this.tryGetMe(attempt + 1);

//         }, 1000);

//       }

//     });

//   }

// }


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

        <div
          class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4">
        </div>

        <p class="text-xl font-semibold text-gray-800 italic uppercase tracking-tighter">
          Đang xác thực tài khoản
        </p>

        <p class="text-sm text-gray-400 mt-2 font-medium">
          Hệ thống đang kết nối, vui lòng đợi trong giây lát
        </p>

      </div>
    </div>
  `
})
export class CallbackComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private auth: AuthService,
    private ngZone: NgZone
  ) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {

      const token = params['token'];

      if (!token) {
        this.router.navigate(['/login']);
        return;
      }

      localStorage.setItem(
        'accessToken',
        decodeURIComponent(token)
      );

      this.loadUser();

    });

  }

  private loadUser(): void {

    this.auth.getMe().subscribe({

      next: (res: any) => {

        if (!res?.user) {
          this.router.navigate(['/login']);
          return;
        }

        this.auth.saveUser(res.user);

        this.ngZone.run(() => {

          /**
           * Dashboard sẽ tự hiện popup nếu needSetPassword=true
           * Không redirect vào set-password ở đây nữa.
           */

          if (!res.user.role) {

            this.router.navigate(
              ['/select-role'],
              {
                replaceUrl: true
              }
            );

            return;
          }

          this.router.navigate(
            ['/dashboard/overview'],
            {
              replaceUrl: true
            }
          );

        });

      },

      error: () => {

        localStorage.removeItem('accessToken');
        localStorage.removeItem('user');

        this.router.navigate(['/login']);

      }

    });

  }

}