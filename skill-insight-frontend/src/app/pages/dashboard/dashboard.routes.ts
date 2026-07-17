import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [

  {
    path: '',
    redirectTo: 'overview',
    pathMatch: 'full'
  },

  {
    path: 'overview',
    loadComponent: () =>
      import('./overview/overview')
        .then(m => m.OverviewComponent)
  },

  {
    path: 'users',
    loadComponent: () =>
      import('./users/users')
        .then(m => m.UsersComponent)
  },

  {
    path: 'users/create',
    loadComponent: () =>
      import('./users/create-user/create-user')
        .then(m => m.CreateUser)
  },

  {
    path: 'users/:id',
    loadComponent: () =>
      import('./users/user-detail/user-detail')
        .then(m => m.UserDetail)
  },

  {
    path: 'subjects',
    loadComponent: () =>
      import('./subjects/subjects/subjects')
        .then(m => m.Subject)
  },

  {
    path: 'subjects/create',
    loadComponent: () =>
      import('./subjects/create-subject/create-subject')
        .then(m => m.CreateSubject)
  },

  {
    path: 'topics',
    loadComponent: () =>
      import('./topics/topics/topics')
        .then(m => m.Topics)
  },

  {
    path: 'topics/create',
    loadComponent: () =>
      import('./topics/create-topic/create-topic')
        .then(m => m.CreateTopic)
  },

  {
  path: 'topics/edit/:id',
  loadComponent: () =>
    import('./topics/edit-topic/edit-topic')
      .then(m => m.EditTopic)
},

  {
    path: 'classes',
    loadComponent: () =>
      import('./classes/class-list/class-list')
        .then(m => m.ClassList)
  },

  {
    path: 'classes/create',
    loadComponent: () =>
      import('./classes/class-create/class-create')
        .then(m => m.ClassCreate)
  },

  {
    path: 'classes/detail/:id',
    loadComponent: () =>
      import('./classes/class-detail/class-detail')
        .then(m => m.ClassDetail)
  },

  {
    path: 'classes/students/:id',
    loadComponent: () =>
      import('./classes/class-students/class-students')
        .then(m => m.ClassStudents)
  },

  {
    path: 'join-class',
    loadComponent: () =>
      import('./classes/join-class/join-class')
        .then(m => m.JoinClassComponent)
  },

  {
    path: 'student/assignments/:id',
    loadComponent: () =>
      import('./student/assignment-detail/assignment-detail')
        .then(m => m.AssignmentDetail)
  },

  {
  path: 'my-classes/:id',
    loadComponent: () =>
      import('./student/my-class-detail/my-class-detail')
        .then(m => m.MyClassDetailComponent)
  },

  {
    path: 'materials',
    loadComponent: () =>
      import('./materials/materials/materials')
        .then(m => m.Materials)
  },

  {
    path: 'learning-materials',
    loadComponent: () =>
      import('./student/learning-materials/learning-materials/learning-materials')
        .then(m => m.LearningMaterials)
  },

  {
    path: 'courses',
    loadComponent: () =>
      import('./courses/courses')
        .then(m => m.CourseComponent)
  },

  {
    path: 'courses/create',
    loadComponent: () =>
      import('./courses/create-course/create-course')
        .then(m => m.CreateCourse)
  },

//   {
//     path: 'questions',
//     loadComponent: () =>
//       import('./questions/question-list/question-list')
//         .then(m => m.QuestionList)
//   },

//   {
//   path: 'questions/edit/:id',
//   loadComponent: () =>
//     import('./questions/question-edit/question-edit')
//       .then(m => m.QuestionEdit)
// },

  // {
  //   path: 'questions/:id',
  //   loadComponent: () =>
  //     import('./questions/question-detail/question-detail')
  //       .then(m => m.QuestionDetail)
  // },
  
  {
    path: 'question-bank',
    loadComponent: () =>
      import('./question-batches/question-bank/question-bank')
        .then(m => m.QuestionBank)
  },

{
  path: 'question-batches/create',
  loadComponent: () =>
    import('./question-batches/batch-create/batch-create')
      .then(m => m.BatchCreate)
},


{
  path: 'question-batches/:id/view',
  loadComponent: () =>
    import('./question-batches/question-batch-view/question-batch-view')
      .then(m => m.QuestionBatchView)
},

{
  path: 'question-batches/:id/edit',
  loadComponent: () =>
    import('./question-batches/batch-detail/batch-detail')
      .then(m => m.BatchDetail)
},

  // ======================================================
// EXAM BANK
// ======================================================

{
  path: 'exams',
  loadComponent: () =>
    import('./exams/exam-list/exam-list')
      .then(m => m.ExamList)
},

{
  path: 'exams/create',
  loadComponent: () =>
    import('./exams/create-exam/create-exam')
      .then(m => m.CreateExam)
},

{
  path: 'exams/:id/view',
  loadComponent: () =>
    import('./exams/exam-view/exam-view')
      .then(m => m.ExamView)
},

{
  path: 'exams/:id/detail',
  loadComponent: () =>
    import('./exams/exam-detail/exam-detail')
      .then(m => m.ExamDetail)
},

{
  path: 'exams/:id/edit',
  loadComponent: () =>
    import('./exams/edit-exam/edit-exam')
      .then(m => m.EditExam)
},

  {
    path: 'assignments',
    loadComponent: () =>
      import('./assignments/assignment-create/assignment-create')
        .then(m => m.AssignmentCreate)
  },

  {
    path: 'assignments/history',
    loadComponent: () =>
      import('./assignments/assign-history/assign-history')
        .then(m => m.AssignHistory)
  },

  {
    path: 'results',
    loadComponent: () =>
      import('./results/results/results')
        .then(m => m.Results)
  },

  {
    path: 'results/:id',
    loadComponent: () =>
      import('./results/result-detail/result-detail')
        .then(m => m.ResultDetail)
  },

  {
    path: 'student-results',
    loadComponent: () =>
      import('./teacher/student-results/student-results/student-results')
        .then(m => m.StudentResults)
  },

  {
    path: 'learning-results',
    loadComponent: () =>
      import('./student/learning-results/learning-results/learning-results')
        .then(m => m.LearningResults)
  },

  {
    path: 'analytics',
    loadComponent: () =>
      import('./analytics/analytics/analytics')
        .then(m => m.Analytics)
  },

  {
    path: 'student-analysis',
    loadComponent: () =>
      import('./teacher/student-analysis/student-analysis/student-analysis')
        .then(m => m.StudentAnalysis)
  },

  {
    path: 'learning-analysis',
    loadComponent: () =>
      import('./student/learning-analysis/learning-analysis/learning-analysis')
        .then(m => m.LearningAnalysis)
  },

  {
    path: 'teacher-ai',
    loadComponent: () =>
      import('./teacher-ai/teacher-ai/teacher-ai')
        .then(m => m.TeacherAi)
  },

  {
    path: 'ai-learning',
    loadComponent: () =>
      import('./student/ai-learning/ai-learning')
        .then(m => m.AiLearning)
  },

  {
    path: 'practice',
    loadComponent: () =>
      import('./student/practice')
        .then(m => m.PracticeComponent)
  },

  {
    path: 'practice-control',
    loadComponent: () =>
      import('./teacher/practice-control/practice-control')
        .then(m => m.PracticeControl)
  },

  {
    path: 'my-classes',
    loadComponent: () =>
      import('./student/my-classes/my-classes')
        .then(m => m.MyClassesComponent)
  },

  {
    path: 'my-exams',
    loadComponent: () =>
      import('./student/my-exams/my-exams')
        .then(m => m.MyExams)
  },

  {
    path: 'my-exams/take/:id',
    loadComponent: () =>
      import('./student/take-exam/take-exam')
        .then(m => m.TakeExam)
  },

  {
    path: 'my-results',
    loadComponent: () =>
      import('./student/my-results/my-results')
        .then(m => m.MyResults)
  },

  {
    path: 'exam/:id',
    loadComponent: () =>
      import('./student/student-exam')
        .then(m => m.StudentExamComponent)
  },

  {
    path: 'result/:id',
    loadComponent: () =>
      import('./student/result')
        .then(m => m.ResultComponent)
  },

  {
    path: 'notifications',
    loadComponent: () =>
      import('./notifications/notifications/notifications')
        .then(m => m.Notifications)
  },

  {
    path: 'system-statistics',
    loadComponent: () =>
      import('./system/system-statistics/system-statistics/system-statistics')
        .then(m => m.SystemStatistics)
  },

  {
    path: 'system-settings',
    loadComponent: () =>
      import('./system/system-settings/system-settings/system-settings')
        .then(m => m.SystemSettings)
  },

  {
    path: 'settings',
    loadComponent: () =>
      import('./settings/settings/settings')
        .then(m => m.Settings)
  },

  {
    path: 'profile',
    loadComponent: () =>
      import('./profile/profile/profile')
        .then(m => m.ProfileComponent)
  },

  {
    path: 'change-password',
    loadComponent: () =>
      import('./profile/change-password/change-password')
        .then(m => m.ChangePasswordComponent)
  },

  {
    path: 'set-password',
    loadComponent: () =>
      import('./profile/set-password/set-password')
        .then(m => m.SetPasswordComponent)
  },
  
  
  {
    path: '**',
    redirectTo: 'overview'
  }
];