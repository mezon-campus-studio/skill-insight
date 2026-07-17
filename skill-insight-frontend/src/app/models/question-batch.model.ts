export interface QuestionBatch {

  batch_id: number;

  batch_code: string;

  batch_name: string;

  description: string;

  subject_id: number;

  topic_id: number;

  teacher_id: number;

  total_questions: number;

  easy_count: number;

  medium_count: number;

  hard_count: number;

  status:
    | 'PRIVATE'
    | 'PENDING'
    | 'APPROVED'
    | 'REJECTED';

  visibility:
    | 'PRIVATE'
    | 'PUBLIC'
    | 'SYSTEM_BANK';

  allow_integrate: boolean;

  is_copied: boolean;

  created_at: string;

  subject?: {
    subject_id: number;
    subject_name: string;
  };

  teacher?: {
    user_id: number;
    full_name: string;
  };

  source: 'SYSTEM' | 'TEACHER';
}