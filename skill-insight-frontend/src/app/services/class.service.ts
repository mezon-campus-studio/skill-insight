import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  // =========================
  // API URL
  // =========================
  private apiUrl =
    'http://localhost:3000/api/classes';

  constructor(
    private http: HttpClient
  ) {}

  // =========================
  // GET ALL
  // =========================
  getClasses() {

    return this.http.get(
      this.apiUrl
    );
  }

  // =========================
  // GET DETAIL
  // =========================
  getClassById(id: number) {

    return this.http.get(
      `${this.apiUrl}/${id}`
    );
  }

  // =========================
  // CREATE
  // =========================
  createClass(data: any) {

    return this.http.post(
      this.apiUrl,
      data
    );
  }

  // =========================
  // UPDATE
  // =========================
  updateClass(
    id: number,
    data: any
  ) {

    return this.http.put(
      `${this.apiUrl}/${id}`,
      data
    );
  }

  // =========================
  // DELETE
  // =========================
  deleteClass(id: number) {

    return this.http.delete(
      `${this.apiUrl}/${id}`
    );
  }

  // =========================
  // DELETE MANY
  // =========================
  deleteManyClasses(
    ids: number[]
  ) {

    return this.http.post(
      `${this.apiUrl}/delete-many`,
      { ids }
    );
  }
}