export interface Exam {

  exam_id: number;

  title: string;

  description?: string;

  subject_id: number;

  topic_id?: number;

  teacher_id: number;

  duration: number;

  pass_score: number;
  
  total_questions: number;

  status_exam:
    | 'DRAFT'
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED';

  visibility:
    | 'PRIVATE'
    | 'PUBLIC'
    | 'SYSTEM_BANK';

  source:
    | 'SYSTEM'
    | 'TEACHER';

  is_copy: boolean;

  allow_system_integration: boolean;

  rejected_reason?: string | null;

  approved_by?: number;

  approved_at?: string;

  created_at: string;

  updated_at: string;

  is_random: boolean;

  random_question_count: number;

  subject?: {
    subject_id: number;
    subject_name: string;
  };

  topic?: {
    topic_id: number;
    topic_name: string;
  };

  teacher?: {
    user_id: number;
    full_name: string;
  };

  _count?: {
    exam_questions: number;
  };

  // =========================
  // THÊM DÒNG NÀY
  // =========================

  exam_questions?: any[];

}