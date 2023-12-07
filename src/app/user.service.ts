import { Injectable, inject } from '@angular/core';
import { Auth, User, user, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { Subscription, of } from 'rxjs';

import { NavigationService } from './navigation.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private auth: Auth = inject(Auth);
  user$ = user(this.auth);
  userSubscription: Subscription;

  constructor(private navigationService: NavigationService) {
    this.userSubscription = this.user$.subscribe((thisUser: User | null) => {
      // Navigate Home whenever user authentication state successfully changes
      // this.navigationService.navigateTo('home');
    });
  }

  ngOnInit(): void {  
    // example use of onAuthStateChanged() if needed
    onAuthStateChanged(this.auth, (user) => {
      console.log('onAuthStateChanged() executed');
      if (user) {
        // User is signed in, see docs for a list of available properties
        // User interface: https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log('uid is', uid);
      } else {
        console.log('user is not signed in');
      }
    });
  }

  signUp(email: string, password: string) {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Successfully signed up
        console.log("user service signUp() userCredential is", userCredential);
      })
      .catch((error) => {
        // Failed to sign up
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('user service signUp() error:', error.message);
      });
  }
  signIn(email: string, password: string) {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Successfully signed in
        console.log("user service signIn() userCredential is", userCredential);
      })
      .catch((error) => {
        // Failed to sign in
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('user service signIn() error:', error.message);
      });
  }

  signOut() {
    signOut(this.auth).then(() => {
      console.log('User signOut() in UserService');
    }).catch((error) => {
      console.error(error);
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
