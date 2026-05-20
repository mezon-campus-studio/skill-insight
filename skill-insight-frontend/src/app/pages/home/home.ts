import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements AfterViewInit {

  constructor(private el: ElementRef) {}

  ngAfterViewInit() {
    this.runCounter();
  }

  runCounter() {
    const counters = this.el.nativeElement.querySelectorAll('.counter');

    counters.forEach((counter: any) => {
      const target = +counter.getAttribute('data-target');
      let count = 0;

      const update = () => {
        const increment = target / 80;

        if (count < target) {
          count += increment;
          counter.innerText = Math.floor(count).toLocaleString() + "+";
          setTimeout(update, 20);
        } else {
          counter.innerText = target.toLocaleString() + "+";
        }
      };

      update();
    });
  }
}