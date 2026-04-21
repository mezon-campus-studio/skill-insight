import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route) => {
  const router = inject(Router);

  // check token
  const token = localStorage.getItem('token');
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  //check user
  const userStr = localStorage.getItem('user');
  if (!userStr) {
    router.navigate(['/login']);
    return false;
  }

  let user: any;

  // parse
  try {
    user = JSON.parse(userStr);
  } catch {
    localStorage.clear();
    router.navigate(['/login']);
    return false;
  }

  // check role
  if (!user?.role) {
    router.navigate(['/login']);
    return false;
  }

  //check token(JWT)
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;

    if (Date.now() > exp) {
      localStorage.clear();
      router.navigate(['/login']);
      return false;
    }
  } catch {
    localStorage.clear();
    router.navigate(['/login']);
    return false;
  }

  //check role
  const roles = route.data?.['roles'] as string[];

  if (roles && !roles.includes(user.role)) {
    router.navigate(['/home']);
    return false;
  }

  return true;
};
