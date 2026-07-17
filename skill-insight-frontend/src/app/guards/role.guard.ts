import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const allowedRoles: string[] = route.data?.['roles'];

  if (!allowedRoles) return true;

  if (allowedRoles.includes(user?.role)) {
    return true;
  }

  return router.createUrlTree(['/login']);
};
