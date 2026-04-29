import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);

  const token = localStorage.getItem('token');

  // Check token
  if (!token) {
    return router.createUrlTree(['/login']);
  }

  try {
    // decode JWT
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;

    if (Date.now() > exp) {
      localStorage.clear();
      return router.createUrlTree(['/login']);
    }

    return true;
  } catch {
    localStorage.clear();
    return router.createUrlTree(['/login']);
  }
};
