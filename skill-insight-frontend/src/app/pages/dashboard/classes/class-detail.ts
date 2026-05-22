import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@Component({
  selector: 'app-class-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-5xl mx-auto" *ngIf="classData">
      <div class="bg-white p-8 rounded-[35px] shadow-2xl border border-gray-100 mb-6">
        <h2 class="text-3xl font-black text-blue-600 uppercase italic">{{classData.class_name}}</h2>
        <p class="text-gray-500 font-bold mt-2">Mã lớp: <span class="text-blue-500">{{classData.class_code}}</span></p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div class="bg-white p-6 rounded-[30px] shadow-lg">
          <h3 class="font-black text-gray-800 mb-4 uppercase">Danh sách học sinh</h3>
          <ul class="space-y-3">
            <li *ngFor="let s of classData.students" class="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">{{s.full_name[0]}}</div>
              <span class="font-medium">{{s.full_name}}</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  `
})
export class ClassDetailComponent implements OnInit {
  classData: any;
  constructor(private route: ActivatedRoute, private http: HttpClient) {}
  ngOnInit() {
    const id = this.route.snapshot.params['id'];
    this.http.get(`${environment.apiUrl}/classes/${id}`, { withCredentials: true }).subscribe(res => this.classData = res);
  }
}
