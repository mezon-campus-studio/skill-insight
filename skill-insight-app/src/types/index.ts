export interface User {
  user_id: number;
  full_name: string;
  email: string;
  password?: string;
  role: 'teacher' | 'student';
  status: number; // 1: Active, 0: Locked
  created_at: Date;
}


export interface Admin {
  admin_id: number;
  username: string;
  password?: string;
  full_name: string;
  email: string;
  created_at: Date;
}


export interface Exam {
  exam_id: number;
  title: string;
  description: string;
  duration: number; // Phút
  subject_id: number;
  teacher_id: number;
  created_at: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
}