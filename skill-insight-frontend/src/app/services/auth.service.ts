
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '@env/environment';
import { Router } from '@angular/router'; // 1. PHẢI CÓ DÒNG NÀY

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly AUTH_API = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private router: Router // 2. PHẢI CÓ DÒNG NÀY TRONG CONSTRUCTOR
  ) {}

  // ✅ LOGIN
  // login(data: any): Observable<any> {
  //   return this.http.post(`${this.AUTH_API}/login`, data, {
  //     withCredentials: true
  //   }).pipe(
  //     tap((res: any) => {
  //       if (res?.success && res?.user) {
  //         this.saveUser(res.user);
  //         if (res.token) {
  //           localStorage.setItem('accessToken', res.token);
  //         }
  //       }
  //     })
  //   );
  // }

login(data: any): Observable<any> {
  return this.http.post(`${this.AUTH_API}/login`, data).pipe(
    tap((res: any) => {

      console.log('LOGIN RESPONSE:', res);

      if (res?.success && res?.user) {
        this.saveUser(res.user);

        // FIX CHỖ NÀY
        const token = res.accessToken || res.token;

        if (token) {
          localStorage.setItem('accessToken', token);
          console.log('TOKEN SAVED');
        }
      }
    })
  );
}

  // ✅ REGISTER
  register(data: any): Observable<any> {
    return this.http.post(`${this.AUTH_API}/register`, data, {
      withCredentials: true
    });
  }

  // ✅ GET CURRENT USER (Đã gộp lại và thêm tự động chuyển hướng)
  getMe(): Observable<any> {
    return this.http.get(`${this.AUTH_API}/me`, {
      withCredentials: true
    }).pipe(
      tap((res: any) => {
  console.log('LOGIN RESPONSE:', res);

  if (res?.success && res?.user) {
    this.saveUser(res.user);

    if (res?.accessToken) {
      localStorage.setItem('accessToken', res.accessToken);
    }
  }
}),
      catchError(err => {
        if (err.status === 401) {
          this.clearUser();
          this.router.navigate(['/login']); // Token hết hạn là văng ra login ngay
        }
        return throwError(() => err);
      })
    );
  }

  // ✅ MEZON URL
  getMezonUrl(): Observable<any> {
    return this.http.get(`${this.AUTH_API}/mezon`, {
      withCredentials: true
    });
  }

  // ✅ UPDATE ROLE
  // updateRole(data: { userId: number; role: string }): Observable<any> {
  //   return this.http.post(`${this.AUTH_API}/update-role`, data, {
  //     withCredentials: true
  //   }).pipe(
  //     tap((res: any) => {
  //       if (res?.success && res?.user) {
  //         this.saveUser(res.user);
  //       }
  //     })
  //   );
  // }
  updateRole(
  data: {
    userId: number;
    role: string;
  }
): Observable<any> {

  return this.http.put(
    `${this.AUTH_API}/users/${data.userId}/role`,
    {
      role: data.role
    },
    {
      withCredentials: true
    }
  ).pipe(
    tap((res: any) => {

      if (res?.success && res?.user) {

        this.saveUser(res.user);

      }

    })
  );

}

  // ✅ GET USER LOCAL
  getUser(): any {
    const user = localStorage.getItem('user');
    try {
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  }

  getCurrentUser() {

  return JSON.parse(
    localStorage.getItem('user') || '{}'
  );

}

  saveUser(user: any): void {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }

  // ✅ CLEAR USER + TOKEN
  clearUser(): void {
    localStorage.removeItem('user');
    localStorage.removeItem('accessToken');
  }

  // ✅ LOGOUT FIXED - BẤM CÁI VỀ LOGIN LUÔN
  logout(): Observable<any> {
    this.clearUser(); // Xóa token trước cho chắc
    return this.http.post(`${this.AUTH_API}/logout`, {}, {
      withCredentials: true
    }).pipe(
      tap(() => {
        this.router.navigate(['/login'], { replaceUrl: true });
      }),
      catchError(err => {
        this.router.navigate(['/login'], { replaceUrl: true });
        return throwError(() => err);
      })
    );
  }
    // ✅ UPDATE PROFILE (Thêm lại hàm này để sửa lỗi TS2551)
  updateProfile(data: any): Observable<any> {
    return this.http.put(`${this.AUTH_API}/profile`, data, {
      withCredentials: true
    }).pipe(
      tap((res: any) => {
        if (res?.success && res?.user) {
          this.saveUser(res.user);
        }
      })
    );
  }
}
