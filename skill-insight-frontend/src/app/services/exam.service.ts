import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  private apiUrl = environment.api.exams;

  constructor(
    private http: HttpClient
  ) {}

  // =====================================================
  // EXAM LIST
  // =====================================================

  // Đề của tôi
  getMyExams() {
    return this.http.get(
      `${this.apiUrl}/my`
    );
  }

  // Kho đề hệ thống
  getSystemExams() {
    return this.http.get(
      `${this.apiUrl}/system`
    );
  }

  // Kho đề giáo viên
  getTeacherExams() {
    return this.http.get(
      `${this.apiUrl}/teacher`
    );
  }

  // Admin xem tất cả
  getAllExams() {
    return this.http.get(
      `${this.apiUrl}/admin`
    );
  }

  // =====================================================
  // DETAIL
  // =====================================================

  getExamById(
    id: number
  ) {
    return this.http.get(
      `${this.apiUrl}/${id}`
    );
  }

  // =====================================================
  // CREATE
  // =====================================================

  createExam(
    data: any
  ) {
    return this.http.post(
      `${this.apiUrl}`,
      data
    );
  }

  // =====================================================
  // UPDATE
  // =====================================================

  updateExam(
    examId: number,
    data: any
  ) {
    return this.http.put(
      `${this.apiUrl}/${examId}`,
      data
    );
  }

  // =====================================================
  // DELETE
  // =====================================================

  deleteExam(
    id: number
  ) {
    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }

  deleteManyExams(
    ids: number[]
  ) {
    return this.http.post(
      `${this.apiUrl}/delete-many`,
      { ids }
    );
  }

  deleteAllExams() {
    return this.http.delete(
      `${this.apiUrl}`
    );
  }

  // =====================================================
  // SUBJECT
  // =====================================================

  getSubjects() {
    return this.http.get(
      `${this.apiUrl}/subjects/all`
    );
  }

  createSubject(
    data: any
  ) {
    return this.http.post(
      `${this.apiUrl}/subjects`,
      data
    );
  }

  // =====================================================
  // TOPIC
  // =====================================================

  getTopics(
    subjectId: number
  ) {
    return this.http.get(
      `${this.apiUrl}/topics/all?subjectId=${subjectId}`
    );
  }

  createTopic(
    data: any
  ) {
    return this.http.post(
      `${this.apiUrl}/topics`,
      data
    );
  }

  // =====================================================
  // QUESTION
  // =====================================================
  getMyQuestions() {

    return this.http.get(

      `${this.apiUrl}/questions/my`

    );

  }

  removeQuestionFromExam(
    examId: number,
    questionId: number
  ) {
    return this.http.delete(
      `${this.apiUrl}/${examId}/questions/${questionId}`
    );
  }

  shuffleExamQuestions(
    examId: number,
    questionCount: number
  ) {
    return this.http.post(
      `${this.apiUrl}/${examId}/shuffle`,
      {
        questionCount
      }
    );
  }

  // =====================================================
  // IMPORT
  // =====================================================

  importExamExcel(
    formData: FormData
  ) {
    return this.http.post(
      `${this.apiUrl}/import`,
      formData
    );
  }

  // =====================================================
  // COPY EXAM
  // =====================================================

  copyExam(
    examId: number
  ) {
    return this.http.post(
      `${this.apiUrl}/${examId}/copy`,
      {}
    );
  }

  // =====================================================
  // SYSTEM INTEGRATION
  // =====================================================

  integrateExam(
    examId: number
  ) {
    return this.http.put(
      `${this.apiUrl}/${examId}/integrate`,
      {}
    );
  }

  cancelIntegrateExam(id: number) {
    return this.http.put(
      `${this.apiUrl}/${id}/cancel-integrate`,
      {}
    );
  }

  approveExam(
    examId: number,
    data: any
  ) {
    return this.http.put(
      `${this.apiUrl}/${examId}/approve`,
      data
    );
  }

  rejectExam(
    examId: number,
    data: any
  ) {
    return this.http.put(
      `${this.apiUrl}/${examId}/reject`,
      data
    );
  }

}


export interface ExamDetail {
  success: boolean;
  data: {
    exam_id: number;
    title: string;
    description: string;
    duration: number;
    pass_score: number;
    status_exam: string;
    visibility: string;

    subject: {
      subject_name: string;
    };

    teacher: {
      full_name: string;
    };

    exam_questions: ExamQuestion[];
  };
}

export interface ExamQuestion {
  question_order: number;

  question: {
    question_id: number;
    content: string;
    level: string;

    answers: {
      answer_id: number;
      answer_text: string;
    }[];
  };
}
