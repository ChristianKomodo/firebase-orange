import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavigationService } from '../navigation.service';
import { UserComponent } from '../user/user.component';
import { debounceTime, fromEvent } from 'rxjs';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, UserComponent],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {
  isHeightExceeded: boolean = false;

  constructor(private el: ElementRef, private renderer: Renderer2, private navigationService: NavigationService) { }

  // Experimental responsive nav height
  // Goal - if the nav items start to stack, make the buttons 100% width so they look nice when stacked
  // If the user changes the viewport width to the point where the nav items have to stack,
  // the nav container height will be greater than 75px. This will then add a class that makes the buttons in the nav to be 100% width 
  // rather than oddly stacking.
  // The tricky part is once the nav height is exceeded, it stays stacked even if the user changes the viewport width back to a larger size.
  // which means it would never go back to the original state of the nav items being inline if they WOULD fit.
  // this is why we set this.isHeightExceeded = false; first, and run checkNavContainerHeight() again after a very short delay.
  ngAfterViewInit() {
    // Check on initial load
    this.checkNavContainerHeight();
    // Make an RxJS stream from the window resize event
    fromEvent(window, 'resize')
    // Only emit after 500ms so the event doesn't fire when the browser moves one pixel
    .pipe(debounceTime(500))
    .subscribe(() => {
      this.isHeightExceeded = false;
        setTimeout(() => {
          this.checkNavContainerHeight();
        }, 10);
      });
  }

  checkNavContainerHeight() {
    const navContainer = this.el.nativeElement.querySelector('.nav-container');
    this.isHeightExceeded = navContainer.offsetHeight > 75;
    console.log('navContainer.offsetHeight', navContainer.offsetHeight);
    console.log('isHeightExceeded', this.isHeightExceeded);
  }

  navigateTo(route: string) {
    this.navigationService.navigateTo(route);
  }
}

