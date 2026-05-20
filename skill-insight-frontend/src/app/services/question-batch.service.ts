import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class QuestionBatchService {

  private apiUrl =
  'http://localhost:3000/api/question-batches';

  private apiQuestionUrl =
  'http://localhost:3000/api/questions';

  constructor(
    private http: HttpClient
  ) {}

  // ======================================================
  // GET ALL BATCHES
  // ======================================================

  getQuestionBatches():
    Observable<any> {

    return this.http.get(
      this.apiUrl
    );

  }

  // ======================================================
  // GET BATCH DETAIL
  // ======================================================

  getQuestionBatchById(
    id: number
  ): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/${id}`
    );

  }

  // ======================================================
  // CREATE BATCH
  // ======================================================

  createQuestionBatch(
    data: any
  ): Observable<any> {

    return this.http.post(
      this.apiUrl,
      data
    );

  }

  // ======================================================
  // ADD QUESTIONS TO BATCH
  // ======================================================

  addQuestionsToBatch(
    id: number,
    question_ids: number[]
  ): Observable<any> {

    return this.http.post(

      `${this.apiUrl}/${id}/questions`,

      {
        question_ids
      }

    );

  }

  // ======================================================
  // APPROVE BATCH
  // ======================================================

  approveBatch(
    id: number,
    data: any
  ): Observable<any> {

    return this.http.patch(
      `${this.apiUrl}/${id}/approve`,
      data
    );

  }

  // ======================================================
  // DELETE BATCH
  // ======================================================

  deleteQuestionBatch(
    id: number
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );

  }

  // ======================================================
  // REMOVE QUESTION
  // ======================================================

  removeQuestionFromBatch(
    batchId: number,
    questionId: number
  ): Observable<any> {

    return this.http.delete(

      `${this.apiUrl}/${batchId}/questions/${questionId}`

    );

  }

  // ======================================================
  // IMPORT EXCEL
  // ======================================================

  importExcel(
    file: File
  ): Observable<any> {

    const formData =
      new FormData();

    formData.append(
      'file',
      file
    );

    return this.http.post(

      `${this.apiUrl}/import`,
      formData

    );

  }

  importQuestionsExcel(formData: FormData) {
  return this.http.post(
    '/api/question-batches/import',
    formData
  );
}

 updateQuestion(questionId: number, data: any) {
  return this.http.put(
    `${this.apiQuestionUrl}/${questionId}`,
    data
  );
}

updateBatchQuestions(batchId: number, questions: any[]) {
  return this.http.put(
    `${this.apiUrl}/${batchId}/questions`,
    { questions }
  );
}

}