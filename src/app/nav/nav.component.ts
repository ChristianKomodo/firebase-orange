import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthComponent } from '../auth/auth.component';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [CommonModule, AuthComponent],
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss']
})
export class NavComponent {

}
