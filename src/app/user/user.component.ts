import { Component, OnDestroy, inject } from '@angular/core';
import { Auth, User, user } from '@angular/fire/auth';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { UserService } from '../user.service';
import { NavigationService } from '../navigation.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnDestroy {
  private auth: Auth = inject(Auth);
  user$ = user(this.auth);
  userSubscription: Subscription;

  constructor(
    private router: Router,
    private userService: UserService,
    private navigationService: NavigationService
  ) {
    this.userSubscription = this.user$.subscribe((aUser: User | null) => {
      //handle user state changes here. Note, that user will be null if there is no currently logged in user.
      console.log('aUser is', aUser);
    })
  }

  logOut() {
    this.userService.signOut();
  }

  navigateTo(route: string) {
    this.navigationService.navigateTo(route);
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }

}












// import { Component, OnDestroy, OnInit, inject } from '@angular/core';
// import { CommonModule } from '@angular/common';
// import { Auth, User, user, authState } from '@angular/fire/auth';
// import { Subscription } from 'rxjs';
// import { UserService } from '../user.service';

// @Component({
//   selector: 'app-user',
//   standalone: true,
//   imports: [CommonModule],
//   templateUrl: './user.component.html',
//   styleUrls: ['./user.component.scss']
// })
// export class UserComponent implements OnInit {
//   private auth: Auth = inject(Auth);
//   userEmail: string | undefined | null = null;
//   user: User | null = null;

//   // The `user` observable streams events triggered by sign-in, sign-out, and token refresh events.
//   user$ = user(this.auth);

//   constructor(private userService: UserService) {
//     // this.user = this.auth.currentUser;
//     // console.log('----------- this.user is', this.user);   // null
//   }

//   ngOnInit(): void {
//     // console.log('ng this.auth.currentUser is', this.auth.currentUser);   // null
//   }

//   clicked() {
//     console.log('clicked!');
//   }

//   logOut() {
//     this.userService.signOut();
//   }

// }