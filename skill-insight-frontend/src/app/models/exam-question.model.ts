export interface ExamQuestion {

  question_id?: number;

  content: string;

  answer_a: string;

  answer_b: string;

  answer_c: string;

  answer_d: string;

  correct_answer: 'A' | 'B' | 'C' | 'D';

  difficulty: 'EASY' | 'MEDIUM' | 'HARD';

  explanation: string;

}