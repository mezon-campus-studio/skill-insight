import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AssignmentService {

  private apiUrl =
    'http://localhost:5000/api/assignments';

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

}