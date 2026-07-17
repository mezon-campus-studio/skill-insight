import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {

  private apiUrl = environment.api.assignments;

  constructor(
    private http: HttpClient
  ) {}

  //
  // CREATE
  //
  createAssignment(data: any) {
    return this.http.post(
      this.apiUrl,
      data
    );
  }

  updateAssignment(
    id: number,
    data: any
  ) {

    return this.http.put(

      `${this.apiUrl}/${id}`,

      data

    );

  }

  //
  // GET DETAIL
  //
  getById(id: number) {

    return this.http.get(

      `${this.apiUrl}/${id}`

    );

  }

  exportScores(
      classId: number
    ) {

      return this.http.get(

        `${this.apiUrl}/class/${classId}/export`,

        {

          responseType: 'blob'

        }

      );

    }
    
    getAssignmentById(
      id: number
    ) {

      return this.http.get<any>(

        `${this.apiUrl}/${id}`

      );

    }

}
