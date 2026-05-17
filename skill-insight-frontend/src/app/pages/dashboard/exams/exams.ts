import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { environment } from '@env/environment';

@Component({
  selector: 'app-exams',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Kho đề thi</h2>
        <button [routerLink]="['create']" class="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700">Tạo đề thi</button>
      </div>
      <div class="overflow-x-auto bg-white rounded-2xl shadow-sm">
        <table class="w-full text-left">
          <thead class="bg-gray-50 border-b">
            <tr>
              <th class="p-4 font-bold text-gray-600">Tên đề</th>
              <th class="p-4 font-bold text-gray-600">Thời gian</th>
              <th class="p-4 font-bold text-gray-600">Số câu hỏi</th>
              <th class="p-4 font-bold text-gray-600">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let exam of exams" class="border-b hover:bg-gray-50">
              <td class="p-4 font-medium">{{exam.title}}</td>
              <td class="p-4 text-gray-500">{{exam.duration}} phút</td>
              <td class="p-4 text-gray-500">{{exam.questions?.length || 0}} câu</td>
              <td class="p-4">
                <button [routerLink]="[exam.exam_id]" class="text-indigo-600 hover:underline">Xem</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  `
})
export class ExamsComponent implements OnInit {
  exams: any[] = [];
  constructor(private http: HttpClient) {}
  ngOnInit() {
    this.http.get<any>(`${environment.apiUrl}/exams`, { withCredentials: true })
      .subscribe(res => this.exams = res.data);
  }
}
