import { Injectable } from '@angular/core';

import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class QuestionService {

  private apiUrl = environment.api.questions;

  constructor(
    private http: HttpClient
  ) {}

  getQuestions(
    page: number = 1,
    limit: number = 9999,
    search: string = '',
    subject_id: string = '',
    topic_id: string = '',
    difficulty: string = ''
  ): Observable<any> {

    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }

    if (subject_id) {
      params = params.set(
        'subject_id',
        subject_id
      );
    }

    if (topic_id) {
      params = params.set(
        'topic_id',
        topic_id
      );
    }

    if (difficulty) {
      params = params.set(
        'difficulty',
        difficulty
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

  getQuestionById(
    id: number
  ): Observable<any> {

    return this.http.get(
      `${this.apiUrl}/${id}`,
      {
        withCredentials: true
      }
    );

  }

  createQuestion(
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

  updateQuestion(
    id: number,
    data: any
  ): Observable<any> {

    return this.http.put(
      `${this.apiUrl}/${id}`,
      data,
      {
        withCredentials: true
      }
    );

  }

  deleteQuestion(
    id: number
  ): Observable<any> {

    return this.http.delete(
      `${this.apiUrl}/${id}`,
      {
        withCredentials: true
      }
    );

  }

  checkQuestionExists(
    data: any
  ): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/check-exists`,
      data,
      {
        withCredentials: true
      }
    );

  }

  getPendingQuestions() {

    return this.http.get(
      `${this.apiUrl}/pending`
    );

  }

//   getQuestionDetail(id: number) {

//   return this.http.get(
//     `${this.apiUrl}/${id}`
//   );

// }

approveQuestion(id: number) {

  return this.http.patch(
    `${this.apiUrl}/${id}/approve`,
    {},
    {
      withCredentials: true
    }
  );

}
  integrateQuestion(
  id: number
) {

  return this.http.patch(

    `${this.apiUrl}/${id}/integrate`,

    {},

    {
      withCredentials: true
    }

  );

}

 importQuestion(payload: any) {

  return this.http.post(
    `${this.apiUrl}/import`,
    payload,
    {
      withCredentials: true
    }
  );

}

  
}