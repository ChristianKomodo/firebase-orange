import { Component, Optional } from '@angular/core';
import { Auth, authState, signOut, User } from '@angular/fire/auth';
import { EMPTY, Observable, Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent {

  public readonly user: Observable<User | null> = EMPTY;

  userEmail: string | null = null;

  showLoginButton = false;
  showLogoutButton = false;

  constructor(
    @Optional() private auth: Auth
  ) {
    if (auth) {
      this.user = authState(auth);
      this.user.subscribe(user => {
        if (user) {
          this.showLogoutButton = true;
          this.userEmail = user.email;
        } else {
          this.showLoginButton = true;
          this.userEmail = 'nope';
        }
      }
      );
    }
  }

  ngOnInit(): void {

  }

  clicked() {
    console.log('clicked!');
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