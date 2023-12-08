import { Component, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Auth, User, user } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

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
