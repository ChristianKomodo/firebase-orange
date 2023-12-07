import { Component } from '@angular/core';
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

  constructor(private navigationService: NavigationService) { }

  navigateTo(route: string) {
    this.navigationService.navigateTo(route);
  }
}

