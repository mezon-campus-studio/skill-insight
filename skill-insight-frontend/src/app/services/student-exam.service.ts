import { Injectable } from '@angular/core';

import {
  HttpClient
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

import {
  environment
} from '@env/environment';

@Injectable({
  providedIn: 'root'
})
export class StudentExamService {

  private API =
    environment.apiUrl;

  constructor(
    private http: HttpClient
  ) {}

  /**
   * GET EXAM
   */
  getExam(id: string): Observable<any> {

    return this.http.get(
      `${this.API}/exams/${id}`
    );

  }

  /**
   * SUBMIT EXAM
   */
  submitExam(data: any): Observable<any> {

    return this.http.post(
      `${this.API}/submissions`,
      data
    );

  }

  /**
   * GET RESULT
   */
  getResult(id: string): Observable<any> {

    return this.http.get(
      `${this.API}/results/${id}`
    );

  }

}