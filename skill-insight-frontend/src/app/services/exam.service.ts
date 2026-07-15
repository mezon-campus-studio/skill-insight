import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';


import { environment }
from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExamService {

  private apiUrl = environment.api.exams;

  constructor(
    private http: HttpClient
  ) {}

  // =========================
  // GET ALL EXAMS
  // =========================
  getExams() {

    return this.http.get(
      `${this.apiUrl}`
    );
  }

  // =========================
  // GET EXAM BY ID
  // =========================
  getExamById(id: number) {

    return this.http.get(
      `${this.apiUrl}/${id}`
    );
  }

  // =========================
  // CREATE EXAM
  // =========================
  createExam(data: any) {

    return this.http.post(
      `${this.apiUrl}`,
      data
    );
  }

  // =========================
  // DELETE ONE
  // =========================
  deleteExam(id: number) {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }

  // =========================
  // DELETE MANY
  // =========================
  deleteManyExams(ids: number[]) {

    return this.http.post(
      `${this.apiUrl}/delete-many`,
      { ids }
    );
  }

  // =========================
  // DELETE ALL
  // =========================
  deleteAllExams() {

    return this.http.delete(
      `${this.apiUrl}`
    );
  }

  // =========================
  // GET SUBJECTS
  // =========================
  getSubjects() {

    return this.http.get(
      `${this.apiUrl}/subjects/all`
    );
  }

  // =========================
  // GET TOPICS
  // =========================
  getTopics(subjectId: number) {

    return this.http.get(
      `${this.apiUrl}/topics/all?subjectId=${subjectId}`
    );
  }

  // =========================
// CREATE SUBJECT
// =========================
createSubject(data: any) {

  return this.http.post(
    `${this.apiUrl}/subjects`,
    data
  );
}

// =========================
// CREATE TOPIC
// =========================
createTopic(data: any) {

  return this.http.post(
    `${this.apiUrl}/topics`,
    data
  );
}

  updateExam(
  examId: number,
  data: any
) {
  return this.http.put(
    `${this.apiUrl}/${examId}`,
    data
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

  // =========================
  // IMPORT EXCEL / CSV
  // =========================
  importExamExcel(
    formData: FormData
  ) {

    return this.http.post(
      `${this.apiUrl}/import`,
      formData
    );
  }

  // =========================
  // SHUFFLE QUESTIONS
  // =========================
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
}