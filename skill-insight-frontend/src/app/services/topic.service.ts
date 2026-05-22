
import {
  Injectable,
  inject
} from '@angular/core';

import {
  HttpClient,
  HttpParams
} from '@angular/common/http';

import {
  Observable
} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TopicService {

  // =====================================
  // INJECT
  // =====================================

  private http =
    inject(HttpClient);

  // =====================================
  // API
  // =====================================

  private apiUrl =
    'http://localhost:3000/api/topics';

  // =====================================
  // GET TOPICS
  // SERVER PAGINATION
  // =====================================

  getTopics(

    page: number = 1,

    limit: number = 5,

    search: string = '',

    subject_id: string = ''

  ): Observable<any> {

    let params =
      new HttpParams()

        .set(
          'page',
          page.toString()
        )

        .set(
          'limit',
          limit.toString()
        );

    // SEARCH
    if (
      search &&
      search.trim()
    ) {

      params =
        params.set(
          'search',
          search.trim()
        );

    }

    // SUBJECT
    if (
      subject_id
    ) {

      params =
        params.set(
          'subject_id',
          subject_id
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

  // =====================================
  // GET ALL TOPICS
  // NO PAGINATION
  // =====================================

  getAllTopics(): Observable<any> {

    return this.http.get(

      `${this.apiUrl}?page=1&limit=999999`,

      {
        withCredentials: true
      }

    );

  }

  // =====================================
  // GET TOPICS BY SUBJECT
  // =====================================

  getTopicsBySubject(
    subjectId: number
  ): Observable<any> {

    return this.http.get(

      `${this.apiUrl}/subject/${subjectId}`,

      {
        withCredentials: true
      }

    );

  }

    // =====================================
  // GET TOPIC BY ID
  // =====================================

  getTopicById(
    id: number
  ): Observable<any> {

    return this.http.get(

      `${this.apiUrl}/${id}`,

      {
        withCredentials: true
      }

    );

  }

  
  // =====================================
  // CREATE TOPIC
  // =====================================

  createTopic(
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

  // =====================================
  // ADD TOPIC
  // =====================================

  add(
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

  // =====================================
  // UPDATE TOPIC
  // =====================================

  updateTopic(

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

  // =====================================
  // DELETE TOPIC
  // =====================================

  deleteTopic(
    id: number
  ): Observable<any> {

    return this.http.delete(

      `${this.apiUrl}/${id}`,

      {
        withCredentials: true
      }

    );

  }

}

