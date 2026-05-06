import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');

  const isPublicApi =
    req.url.includes('/login') ||
    req.url.includes('/register') ||
    req.url.includes('/callback') ||
    req.url.includes('/auth/mezon');
  let headers = req.headers;

  if (token && !isPublicApi) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }
  const authReq = req.clone({
    withCredentials: true,
    headers,
  });
  return next(authReq).pipe(
    catchError((err) => {
      if (err.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');

        if (!router.url.includes('/login')) {
          router.navigate(['/login']);
        }
      }
      return throwError(() => err);
    }),
  );
};
