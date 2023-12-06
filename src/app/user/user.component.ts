import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, User, user, authState } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnDestroy {
  private auth: Auth = inject(Auth);
  userEmail: string | undefined | null = null;
  
  // The `user` observable streams events triggered by sign-in, sign-out, and token refresh events.
  user$ = user(this.auth);
  userSubscription: Subscription;

  constructor() {
    this.userSubscription = this.user$.subscribe((aUser: User | null) => {
      console.log('------- UserComponent aUser', aUser);
      this.userEmail = aUser?.email;
    })
  }

  clicked() {
    console.log('clicked!  User is', this.userEmail);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}