import { Component, ElementRef, HostListener, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavigationService } from '../navigation.service';
import { UserComponent } from '../user/user.component';

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

  ngAfterViewInit() {
    this.checkNavContainerHeight();
  }

  @HostListener('window:resize')
  onResize() {
    this.isHeightExceeded = false;
    setTimeout(() => {
      this.checkNavContainerHeight();
    }, 100);
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

