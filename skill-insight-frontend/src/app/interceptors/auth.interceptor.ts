import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  const token = localStorage.getItem('accessToken'); 

  let authReq = req.clone({
    withCredentials: true
  });

  if (token) {
    authReq = authReq.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((err) => {
      if (err.status === 401) {
        console.warn('Unauthorized');

        const isAuthPage =
          router.url.includes('/login') ||
          router.url.includes('/callback');

        if (!isAuthPage) {
          localStorage.removeItem('accessToken'); 
          router.navigate(['/login']);
        }
      }

      return throwError(() => err);
    })
  );
};