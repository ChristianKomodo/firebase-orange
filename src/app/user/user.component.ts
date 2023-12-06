import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, User, user, authState } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {
  private auth: Auth = inject(Auth);
  userEmail: string | undefined | null = null;
  user: User | null = null;

  // The `user` observable streams events triggered by sign-in, sign-out, and token refresh events.
  user$ = user(this.auth);

  constructor(private userService: UserService) {
  }

  clicked() {
    console.log('clicked!');
  }

  logOut() {
    this.userService
  }

}