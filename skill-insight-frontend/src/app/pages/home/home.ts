import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h2>Home</h2>

    <div *ngIf="user; else noUser">
      <p><b>Email:</b> {{ user.email }}</p>
      <p><b>Role:</b> {{ user.role }}</p>
    </div>

    <ng-template #noUser>
      <p>Chưa có user</p>
    </ng-template>
  `,
})
export class HomeComponent implements OnInit {
  user: any = null;

  ngOnInit(): void {
    const data = localStorage.getItem('user');
    if (data) {
      this.user = JSON.parse(data);
    }
  }
}
