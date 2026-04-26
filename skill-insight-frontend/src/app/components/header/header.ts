import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-header',
  imports: [RouterModule, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  user: any = null; 

    isOpen = false;

    toggleDropdown() {
      this.isOpen = !this.isOpen;
    }

    logout() {
      this.user = null;
    }
}
