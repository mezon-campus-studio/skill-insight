import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';

import { DashboardComponent } from './layouts/dashboard/dashboard';

import { SelectRoleComponent } from './pages/select-role/select-role';

import { Overview } from './pages/dashboard/overview/overview';
import { Courses } from './pages/dashboard/courses/courses';
import { Assignments } from './pages/dashboard/assignments/assignments';
import { Users } from './pages/dashboard/users/users';
//import { Questions } from './pages/dashboard/questions/questions';

export const routes: Routes = [
  {
    path: '',
    component: Home
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
    path: 'select-role',
    component: SelectRoleComponent
  },

  {
    path: 'dashboard',
    component: DashboardComponent,
    children: [
      {
        path: '',
        component: Overview,
        pathMatch: 'full'
      },

      {
        path: 'users',
        component: Users
      },

      {
        path: 'courses',
        component: Courses
      },

      {
        path: 'assignments',
        component: Assignments
      },

      // {
      //   path: 'questions',
      //   component: Questions
      // }
    ],
  },

  {
    path: '**',
    redirectTo: ''
  }
];