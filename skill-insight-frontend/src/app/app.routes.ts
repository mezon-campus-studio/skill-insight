import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { SelectRoleComponent } from './pages/select-role/select-role';
import { CallbackComponent } from './pages/callback/callback';

import { DashboardComponent } from './layouts/dashboard/dashboard';

import { authGuard } from './guards/auth.guard';

export const routes: Routes = [

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    component: LoginComponent
  },

  {
    path: 'register',
    component: RegisterComponent
  },

  {
    path: 'callback',
    component: CallbackComponent
  },

  {
    path: 'select-role',
    component: SelectRoleComponent,
    canActivate: [authGuard]
  },

  {
    path: 'dashboard',

    component: DashboardComponent,

    canActivate: [authGuard],

    loadChildren: () =>
      import('./pages/dashboard/dashboard.routes')
        .then(m => m.dashboardRoutes)
  },

  {
    path: '**',
    redirectTo: 'login'
  }
];