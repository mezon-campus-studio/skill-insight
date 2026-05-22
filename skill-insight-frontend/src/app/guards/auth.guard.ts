import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const token = localStorage.getItem('access_token');

  // Check token
  if (!token) {
    return router.createUrlTree(['/login']);
  }

  return auth.getMe().pipe(
    map((res: any) => {
      if (!res?.success || !res?.user) {
        auth.clearUser();
        return router.createUrlTree(['/login']);
      }

      //lưu user
      const user = res.user;
      auth.saveUser(user);
      //check role
      const role = user.role;
      if (!role) {
        if (state.url === '/select-role') {
          return true;
        }
        return router.createUrlTree(['/select-role']);
      }
      if (state.url === '/select-role') {
        return router.createUrlTree(['/subject']);
      }

      return true;
    }),
    catchError(() => of(router.createUrlTree(['/login']))),
  );
};
