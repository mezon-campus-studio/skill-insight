import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // 🔥 THÊM

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, CommonModule], // 🔥 THÊM
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  get user() {
    return JSON.parse(localStorage.getItem('user') || 'null');
  }
  isOpen = false;

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }
  
  logout() {
    localStorage.clear();
    window.location.href = '/';
  }
}