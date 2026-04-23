import { Component, signal } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { Footer } from './components/footer/footer';
import { Header } from "./components/header/header";
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    Header,
    Footer,
  ],
  templateUrl: './app.html'
})
export class App {
  protected readonly title = signal('skill-insight-frontend');
}