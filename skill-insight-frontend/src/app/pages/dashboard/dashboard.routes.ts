import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [

  { path: '', redirectTo: 'overview', pathMatch: 'full' },

  {
    path: 'overview',
    loadComponent: () => import('./overview/overview')
      .then(m => m.OverviewComponent)
  },

  {
    path: 'classes',
    loadComponent: () => import('./classes/classes')
      .then(m => m.ClassesComponent)
  },
  {
    path: 'classes/create',
    loadComponent: () => import('./classes/create-class')
      .then(m => m.CreateClassComponent)
  },
  {
    path: 'classes/:id',
    loadComponent: () => import('./classes/class-detail')
      .then(m => m.ClassDetailComponent)
  },
  {
    path: 'join-class', // dành cho student
    loadComponent: () => import('./classes/join-class')
      .then(m => m.JoinClassComponent)
  },

  {
    path: 'courses',
    loadComponent: () => import('./courses/courses')
      .then(m => m.CourseComponent)
  },

  {
    path: 'exams',
    loadComponent: () => import('./exams/exams')
      .then(m => m.ExamsComponent)
  },
  {
    path: 'exams/create',
    loadComponent: () => import('./exams/create-exam')
      .then(m => m.CreateExamComponent)
  },
  {
    path: 'exams/:id',
    loadComponent: () => import('./exams/exam-detail')
      .then(m => m.ExamDetailComponent)
  },

  {
    path: 'questions',
    loadComponent: () => import('./questions/questions')
      .then(m => m.QuestionsComponent)
  },
  {
    path: 'questions/create',
    loadComponent: () => import('./questions/create-question')
      .then(m => m.CreateQuestionComponent)
  },

  {
    path: 'assign',
    loadComponent: () => import('./assignments/assign-exam')
      .then(m => m.AssignExamComponent)
  },

  {
    path: 'my-classes',
    loadComponent: () => import('./student/my-classes')
      .then(m => m.MyClassesComponent)
  },
  {
    path: 'exam/:id',
    loadComponent: () => import('./student/student-exam')
      .then(m => m.StudentExamComponent)
  },
  {
    path: 'result/:id',
    loadComponent: () => import('./student/result')
      .then(m => m.ResultComponent)
  },
  {
    path: 'practice',
    loadComponent: () => import('./student/practice')
      .then(m => m.PracticeComponent)
  },
  
  {
    path: 'profile',
    loadComponent: () => import('./profile/profile')
      .then(m => m.ProfileComponent)
  },
  {
    path: 'change-password',
    loadComponent: () => import('./profile/change-password')
      .then(m => m.ChangePasswordComponent)
  },
  {
    path: 'set-password',
    loadComponent: () => import('./profile/set-password')
      .then(m => m.SetPasswordComponent)
  }
];
