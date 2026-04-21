import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { HomeComponent } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Student } from './pages/student/student';
import { Teacher } from './pages/teacher/teacher';
import { Admin } from './pages/admin/admin';
import { CallbackComponent } from './pages/callback/callback';
export const routes: Routes = [
  { path: '', component: Login, canActivate: [authGuard] },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'student', component: Student, canActivate: [authGuard], data: { role: 'student' } },
  { path: 'teacher', component: Teacher, canActivate: [authGuard], data: { role: 'teacher' } },
  { path: 'admin', component: Admin, canActivate: [authGuard], data: { role: 'admin' } },
  { path: 'callback', component: CallbackComponent },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [authGuard],
    data: { roles: ['student', 'teacher', 'admin'] },
  },
];
