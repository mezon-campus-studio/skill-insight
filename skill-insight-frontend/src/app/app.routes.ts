import { Routes } from '@angular/router';

import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Student } from './pages/student/student';
import { Teacher } from './pages/teacher/teacher';
import { Admin } from './pages/admin/admin';
import { CallbackComponent } from './pages/callback/callback';
export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'student', component: Student },
  { path: 'teacher', component: Teacher },
  { path: 'admin', component: Admin },
  { path: 'callback', component: CallbackComponent },
];
