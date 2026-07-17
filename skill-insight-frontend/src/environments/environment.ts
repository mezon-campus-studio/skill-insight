export const environment = {
  production: false,

  backendUrl: 'http://localhost:3000',

  apiUrl: 'http://localhost:3000/api',

  api: {
    auth: 'http://localhost:3000/api/auth',

    subjects: 'http://localhost:3000/api/subjects',

    topics: 'http://localhost:3000/api/topics',

    questions: 'http://localhost:3000/api/questions',

    questionBatches:
      'http://localhost:3000/api/question-batches',

    exams: 'http://localhost:3000/api/exams',

    assignments:
      'http://localhost:3000/api/assignments',

    results: 'http://localhost:3000/api/results',

    users: 'http://localhost:3000/api/users',

    students: 'http://localhost:3000/api/students',

    teachers: 'http://localhost:3000/api/teachers',

    classes: 'http://localhost:3000/api/classes',

    courses: 'http://localhost:3000/api/courses',

    materials: 'http://localhost:3000/api/materials',

    analytics: 'http://localhost:3000/api/analytics',

    notifications:
      'http://localhost:3000/api/notifications',

    settings: 'http://localhost:3000/api/settings',

    system: 'http://localhost:3000/api/system',

    teacherAi:
      'http://localhost:3000/api/teacher-ai',
  },

  mezon: {
    clientId: '2045424385258426368',

    redirectUri:
      'http://localhost:4200/callback',

    authUrl:
      'https://oauth2.mezon.ai/oauth2/auth',
  }
};