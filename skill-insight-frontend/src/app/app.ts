import { Component, signal, OnInit } from '@angular/core';
import { Router, NavigationEnd, RouterOutlet, RouterModule } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, Header, Footer, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  protected readonly title = signal('skill-insight-frontend');
  isDashboard = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isDashboard = event.urlAfterRedirects.startsWith('/dashboard');
      });
  }
}
