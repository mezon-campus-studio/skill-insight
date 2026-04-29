import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Student } from './pages/student/student';
import { Teacher } from './pages/teacher/teacher';
import { Admin } from './pages/admin/admin';
import { CallbackComponent } from './pages/callback/callback';
import { Subject } from './pages/subject/subject';
export const routes: Routes = [
  { path: '', component: Login },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'student', component: Student, canActivate: [authGuard], data: { roles: ['student'] } },
  { path: 'teacher', component: Teacher, canActivate: [authGuard], data: { roles: ['teacher'] } },
  { path: 'admin', component: Admin, canActivate: [authGuard], data: { roles: ['admin'] } },
  { path: 'callback', component: CallbackComponent },
  { path: 'subject', component: Subject },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
    data: { roles: ['student', 'teacher', 'admin'] },
  },
];
