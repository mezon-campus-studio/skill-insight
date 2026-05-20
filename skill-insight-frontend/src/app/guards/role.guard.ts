import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const router = inject(Router);

  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const requiredRole = route.data?.['role'];

  if (user?.role === requiredRole) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};