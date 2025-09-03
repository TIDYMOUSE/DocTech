import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  trigger,
  transition,
  keyframes,
  animate,
  style,
  state,
} from '@angular/animations';
import { NavbarComponent } from '../navbar/navbar.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NavbarComponent, RouterLink],
  templateUrl: './home.component.html',
  animations: [
    trigger('scroll', [
      state('start', style({ transform: 'translateX(0%)' })),
      state('end', style({ transform: 'translateX(-100%)' })),
      transition('start => end', animate('20s linear')),
    ]),
  ],
})
export class HomeComponent {
  items: string[] = Array(19).fill('faker');
  scrollState = 'start';
  scrollState2 = 'start';

  ngOnInit() {
    // Start first list animation
    this.scrollState = 'end';

    // Delay second list animation to create seamless effect
    setTimeout(() => {
      this.scrollState2 = 'end';
    }, 0);
  }

  onAnimationDone() {
    // Reset and restart animation for continuous effect
    this.scrollState = 'start';
    setTimeout(() => {
      this.scrollState = 'end';
    }, 0);
  }

  onAnimationDone2() {
    // Reset and restart animation for continuous effect
    this.scrollState2 = 'start';
    setTimeout(() => {
      this.scrollState2 = 'end';
    }, 0);
  }
}
