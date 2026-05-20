import { Routes } from '@angular/router';

import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { SelectRoleComponent } from './pages/select-role/select-role';
import { CallbackComponent } from './pages/callback/callback';
import { SetPasswordComponent } from './pages/set-password/set-password';

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
    path: 'set-password',
    component: SetPasswordComponent,
    canActivate: [authGuard]
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
    children: [
      {
        path: '',
        redirectTo: 'overview',
        pathMatch: 'full'
      },
    
      {
        path: 'overview',
        loadComponent: () =>
          import('./pages/dashboard/overview/overview').then(m => m.OverviewComponent)
      },

      {
        path: 'users',
        loadComponent: () =>
          import('./pages/dashboard/users/users').then(m => m.UsersComponent)
      },

      {
        path: 'classes',
        loadComponent: () =>
          import('./pages/dashboard/classes/classes').then(m => m.ClassesComponent)
      },
      {
        path: 'classes/create',
        loadComponent: () =>
          import('./pages/dashboard/classes/create-class').then(m => m.CreateClassComponent)
      },
      {
        path: 'classes/:id',
        loadComponent: () =>
          import('./pages/dashboard/classes/class-detail').then(m => m.ClassDetailComponent)
      },
      {
        path: 'join-class',
        loadComponent: () =>
          import('./pages/dashboard/classes/join-class').then(m => m.JoinClassComponent)
      },

      {
        path: 'courses',
        loadComponent: () =>
          import('./pages/dashboard/courses/courses').then(m => m.CourseComponent)
      },

      {
        path: 'exams',
        loadComponent: () =>
          import('./pages/dashboard/exams/exams').then(m => m.ExamsComponent)
      },
      {
        path: 'exams/create',
        loadComponent: () =>
          import('./pages/dashboard/exams/create-exam').then(m => m.CreateExamComponent)
      },
      {
        path: 'exams/:id',
        loadComponent: () =>
          import('./pages/dashboard/exams/exam-detail').then(m => m.ExamDetailComponent)
      },
      {
        path: 'questions',
        loadComponent: () =>
          import('./pages/dashboard/questions/questions').then(m => m.QuestionsComponent)
      },
      {
        path: 'questions/create',
        loadComponent: () =>
          import('./pages/dashboard/questions/create-question').then(m => m.CreateQuestionComponent)
      },

      {
        path: 'assignments',
        loadComponent: () =>
          import('./pages/dashboard/assignments/assign-exam').then(m => m.AssignExamComponent)
      },

      {
        path: 'my-classes',
        loadComponent: () =>
          import('./pages/dashboard/student/my-classes').then(m => m.MyClassesComponent)
      },
      {
        path: 'exam/:id',
        loadComponent: () =>
          import('./pages/dashboard/student/student-exam').then(m => m.StudentExamComponent)
      },
      {
        path: 'result/:id',
        loadComponent: () =>
          import('./pages/dashboard/student/result').then(m => m.ResultComponent)
      },
      {
        path: 'practice',
        loadComponent: () =>
          import('./pages/dashboard/student/practice').then(m => m.PracticeComponent)
      },

      {
        path: 'profile',
        loadComponent: () =>
          import('./pages/dashboard/profile/profile').then(m => m.ProfileComponent)
      },
      {
        path: 'change-password',
        loadComponent: () =>
          import('./pages/dashboard/profile/change-password').then(m => m.ChangePasswordComponent)
      },
      {
        path: 'set-password',
        loadComponent: () =>
          import('./pages/dashboard/profile/set-password').then(m => m.SetPasswordComponent)
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
