import { Routes } from '@angular/router';

<<<<<<< HEAD
export const routes: Routes = [];
=======
import { Home } from './pages/home/home';
import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Student } from './pages/student/student';
import { Teacher } from './pages/teacher/teacher';
import { Admin } from './pages/admin/admin';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'student', component: Student },
  { path: 'teacher', component: Teacher },
  { path: 'admin', component: Admin }
];
>>>>>>> b73aed34984ada974728b403899ea1204bb2cce0
