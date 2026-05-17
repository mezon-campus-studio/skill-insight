import { Routes } from '@angular/router';
import { LoginComponent } from '@pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { SelectRoleComponent } from './pages/select-role/select-role';
import { CallbackComponent } from './pages/callback/callback';
import { SetPasswordComponent } from './pages/set-password/set-password';

import { DashboardComponent } from './layouts/dashboard/dashboard';
import { authGuard } from './guards/auth.guard';
import { Home } from './pages/home/home';
import { Subject } from './pages/subject/subject';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'callback', component: CallbackComponent },

  {
    path: 'set-password',
    component: SetPasswordComponent,
    canActivate: [authGuard],
  },
  {
    path: 'select-role',
    component: SelectRoleComponent,
    canActivate: [authGuard],
  },
  {
    path: 'home',
    component: Home,
    canActivate: [authGuard],
    data: { roles: ['student', 'teacher', 'admin'] },
  },

  {
    path: 'subject',
    canActivate: [authGuard],
    component: Subject,
  },

  // dashboard chính
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'overview', pathMatch: 'full' },

      {
        path: 'overview',
        loadComponent: () =>
          import('./pages/dashboard/overview/overview').then((m) => m.OverviewComponent),
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/dashboard/users/users').then((m) => m.UsersComponent),
      },
      {
        path: 'classes',
        loadComponent: () =>
          import('./pages/dashboard/classes/classes').then((m) => m.ClassesComponent),
      },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
