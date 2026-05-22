import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { environment } from '@env/environment';

@Component({
  selector: 'app-classes',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-800">Quản lý lớp học</h2>
        <button [routerLink]="['create']" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition">
          + Tạo lớp mới
        </button>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div *ngFor="let item of classes" class="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition">
          <h3 class="font-bold text-lg text-blue-600">{{item.class_name}}</h3>
          <p class="text-gray-500 text-sm mt-1">Mã lớp: {{item.class_code}}</p>
          <div class="mt-4 flex justify-between items-center">
            <span class="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{{item._count?.students || 0}} học sinh</span>
            <button [routerLink]="[item.class_id]" class="text-blue-600 text-sm font-semibold hover:underline">Chi tiết →</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ClassesComponent implements OnInit {
  classes: any[] = [];
  constructor(private http: HttpClient) {}
  ngOnInit() { this.loadClasses(); }
  loadClasses() {
    this.http.get<any>(`${environment.apiUrl}/classes`, { withCredentials: true })
      .subscribe(res => this.classes = res.data);
  }
}
