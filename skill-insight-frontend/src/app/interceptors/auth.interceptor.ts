import {
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';

import { inject } from '@angular/core';
import { Router } from '@angular/router';

import {
  catchError,
  throwError
} from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const router = inject(Router);

  // =========================
  // FIX TOKEN RETRIEVAL
  // =========================
  const token =
    localStorage.getItem('accessToken') ||
    localStorage.getItem('token') ||
    localStorage.getItem('authToken');

  console.log('[INTERCEPTOR TOKEN]', token);

  let authReq = req;

  // =========================
  // ATTACH TOKEN IF VALID
  // =========================
  if (token && token !== 'null' && token !== 'undefined') {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(
    catchError((err: HttpErrorResponse) => {

      if (err.status === 401) {

        const isAuthPage =
          router.url.includes('/login') ||
          router.url.includes('/callback');

        if (!isAuthPage) {

          // clear all possible token keys
          localStorage.removeItem('accessToken');
          localStorage.removeItem('token');
          localStorage.removeItem('authToken');

          router.navigate(['/login']);
        }
      }

      return throwError(() => err);
    })
  );
};
