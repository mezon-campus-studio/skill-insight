import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, catchError, of } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.getMe().pipe(
    map((res: any) => {
      const user = res?.user;

      if (!user) {
        return router.createUrlTree(['/login']);
      }

      // ✅ lưu user
      auth.saveUser(user);

      // 🔥 role flow
      if (!user.role) {
        if (state.url === '/select-role') {
          return true;
        }
        return router.createUrlTree(['/select-role']);
      }

      // 🔥 role permission
      const roles = route.data?.['roles'] as string[];

      if (roles && !roles.includes(user.role)) {
        return router.createUrlTree(['/dashboard']);
      }

      return true;
    }),
    catchError(() => {
      return of(router.createUrlTree(['/login']));
    })
  );
};