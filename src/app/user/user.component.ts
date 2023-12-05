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
  // User
  // The `user` observable streams events triggered by sign-in, sign-out, and token refresh events.
  user$ = user(this.auth);
  userSubscription: Subscription;
  // AuthState
  // The `authState` observable streams events triggered by sign-in and sign-out events.
  authState$ = authState(this.auth);
  authStateSubscription: Subscription;



  constructor() {
    // USER
    this.userSubscription = this.user$.subscribe((aUser: User | null) => {
      // Handle user state changes here.
      // Note, that user will be null if there is no currently logged in user.
      console.log('------- UserComponent aUser', aUser);
    })
    // AUTHSTATE
    this.authStateSubscription = this.authState$.subscribe((aUser: User | null) => {
      //handle auth state changes here. Note, that user will be null if there is no currently logged in user.
      console.log(aUser);
    })
  }

  ngOnDestroy() {
    // USER
    // AUTHSTATE
    // when manually subscribing to an observable remember to unsubscribe in ngOnDestroy
    this.userSubscription.unsubscribe();
    // (AuthState) when manually subscribing to an observable remember to unsubscribe in ngOnDestroy
    this.authStateSubscription.unsubscribe();
  }

}