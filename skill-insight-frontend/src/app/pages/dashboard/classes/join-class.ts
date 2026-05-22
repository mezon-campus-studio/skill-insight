import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '@env/environment';

@Component({
  selector: 'app-join-class',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="max-w-md mx-auto mt-20 bg-white p-10 rounded-[40px] shadow-2xl text-center">
      <h2 class="text-2xl font-black text-gray-800 uppercase mb-6">Tham gia lớp học</h2>
      <input [(ngModel)]="code" placeholder="Nhập mã lớp học" class="w-full px-5 py-4 bg-blue-50 rounded-2xl outline-none text-center text-xl font-bold tracking-widest uppercase mb-6 focus:ring-4 focus:ring-blue-100 transition-all">
      <button (click)="join()" class="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase hover:bg-blue-700 transition active:scale-95 shadow-lg shadow-blue-200">XÁC NHẬN THAM GIA</button>
    </div>
  `
})
export class JoinClassComponent {
  code = '';
  constructor(private http: HttpClient) {}
  join() {
    this.http.post(`${environment.apiUrl}/classes/join`, { code: this.code }, { withCredentials: true })
      .subscribe(() => alert('Tham gia thành công!'));
  }
}
