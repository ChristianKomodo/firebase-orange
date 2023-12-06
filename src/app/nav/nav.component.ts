import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { AuthComponent } from '../auth/auth.component';
import { UserComponent } from '../user/user.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, AuthComponent, UserComponent],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {

  constructor(private router: Router) { }

  navigateTo(route: string) {
    this.router.navigate([`/${route}`]);
  }
}
