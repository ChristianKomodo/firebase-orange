import { Injectable, inject } from '@angular/core';
import { Auth, User, user, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { BehaviorSubject, Observable, Subscription, of } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private auth: Auth = inject(Auth);
  user$ = user(this.auth);
  userSubscription: Subscription;

  constructor() {
    this.userSubscription = this.user$.subscribe((aUser: User | null) => {
      //handle user state changes here. Note, that user will be null if there is no currently logged in user.
      console.log('aUser from UserService is', aUser);
    });
  }

  signUp(email: string, password: string) {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed up
        const user = userCredential.user;
        console.log("user service signUp() userCredential.user is", user);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('user service signUp() error:', error.message);
      });
  }
  signIn(email: string, password: string) {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        console.log("user service signIn() userCredential.user is", user);
      })
      .catch((error) => {
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
    // when manually subscribing to an observable remember to unsubscribe in ngOnDestroy
    this.userSubscription.unsubscribe();
  }
}
