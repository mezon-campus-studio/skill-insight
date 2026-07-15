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

}