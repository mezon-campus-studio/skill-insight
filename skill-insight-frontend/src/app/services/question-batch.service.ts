import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  environment
} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class QuestionBatchService {

  private apiUrl = environment.api.questionBatches;

  private apiQuestionUrl = environment.api.questions;

  constructor(
    private http: HttpClient
  ) {}

  // ======================================================
  // GET ALL BATCHES (ADMIN)
  // ======================================================

  getAllBatches(): Observable<any> {

    return this.http.get(

      `${this.apiUrl}/all`,

      {
        withCredentials: true
      }

    );

  }

  // ======================================================
  // GET MY BATCHES (TEACHER)
  // ======================================================

  getMyBatches(): Observable<any> {

    return this.http.get(

      `${this.apiUrl}/my`,

      {
        withCredentials: true
      }

    );

  }

  // ======================================================
  // GET SYSTEM BATCHES
  // ======================================================

  getSystemBatches(): Observable<any> {

    return this.http.get(

      `${this.apiUrl}/system`,

      {
        withCredentials: true
      }

    );

  }

  // ======================================================
  // GET PUBLIC TEACHER BATCHES
  // ======================================================

  getTeacherPublicBatches(): Observable<any> {

    return this.http.get(

      `${this.apiUrl}/teacher-public`,

      {
        withCredentials: true
      }

    );

  }

  // ======================================================
  // FILTER BATCHES
  // ======================================================

  getQuestionBatchesByFilter(

    keyword: string = '',

    subjectId?: number,

    source?: string

  ): Observable<any> {

    let params = new HttpParams();

    if (keyword) {

      params = params.set(
        'keyword',
        keyword
      );

    }

    if (subjectId) {

      params = params.set(
        'subjectId',
        subjectId
      );

    }

    if (source) {

      params = params.set(
        'source',
        source
      );

    }

    return this.http.get(

      this.apiUrl,

      {

        params,

        withCredentials: true

      }

    );

  }

  // ======================================================
  // GET BATCH DETAIL
  // ======================================================

  getQuestionBatchById(
    id: number
  ): Observable<any> {

    return this.http.get(

      `${this.apiUrl}/${id}`,

      {
        withCredentials: true
      }

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

      data,

      {
        withCredentials: true
      }

    );

  }

  // ======================================================
  // UPDATE BATCH
  // ======================================================

  updateQuestionBatch(
    batchId: number,
    data: any
  ): Observable<any> {

    return this.http.put(

      `${this.apiUrl}/${batchId}`,

      data,

      {
        withCredentials: true
      }

    );

  }

  // ======================================================
  // DELETE BATCH
  // ======================================================

  deleteQuestionBatch(
    id: number
  ): Observable<any> {

    return this.http.delete(

      `${this.apiUrl}/${id}`,

      {
        withCredentials: true
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

      data,

      {
        withCredentials: true
      }

    );

  }

  // ======================================================
  // INTEGRATE TO SYSTEM
  // ======================================================

  integrateBatch(
    id: number
  ): Observable<any> {

    return this.http.patch(

      `${this.apiUrl}/${id}/integrate`,

      {},

      {
        withCredentials: true
      }

    );

  }

  // ======================================================
  // PUBLIC / PRIVATE
  // ======================================================

  updateVisibility(

    batchId: number,

    visibility: 'PUBLIC' | 'PRIVATE'

  ): Observable<any> {

    return this.http.patch(

      `${this.apiUrl}/${batchId}/visibility`,

      {

        visibility

      },

      {

        withCredentials: true

      }

    );

  }

  // ======================================================
  // COPY BATCH
  // ======================================================

  copyBatch(
    batchId: number
  ): Observable<any> {

    return this.http.post(

      `${this.apiUrl}/${batchId}/copy`,

      {},

      {
        withCredentials: true
      }

    );

  }

  // ======================================================
  // GET QUESTIONS OF BATCH
  // ======================================================

  getBatchQuestions(
    batchId: number
  ): Observable<any> {

    return this.http.get(

      `${this.apiUrl}/${batchId}/questions`,

      {
        withCredentials: true
      }

    );

  }

  // ======================================================
  // ADD QUESTIONS
  // ======================================================

  addQuestionsToBatch(

    batchId: number,

    questionIds: number[]

  ): Observable<any> {

    return this.http.post(

      `${this.apiUrl}/${batchId}/questions`,

      {

        question_ids: questionIds

      },

      {

        withCredentials: true

      }

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

      `${this.apiUrl}/${batchId}/questions/${questionId}`,

      {

        withCredentials: true

      }

    );

  }

  // ======================================================
  // UPDATE ALL QUESTIONS
  // ======================================================

  updateBatchQuestions(

    batchId: number,

    questions: any[]

  ): Observable<any> {

    return this.http.put(

      `${this.apiUrl}/${batchId}/questions`,

      {

        questions

      },

      {

        withCredentials: true

      }

    );

  }

  // ======================================================
  // UPDATE ONE QUESTION
  // ======================================================

  updateQuestion(

    questionId: number,

    data: any

  ): Observable<any> {

    return this.http.put(

      `${this.apiQuestionUrl}/${questionId}`,

      data,

      {

        withCredentials: true

      }

    );

  }

  // ======================================================
  // IMPORT EXCEL
  // ======================================================

  importQuestionsExcel(
    formData: FormData
  ): Observable<any> {

    return this.http.post(

      `${this.apiUrl}/import`,

      formData,

      {

        withCredentials: true

      }

    );

  }

}