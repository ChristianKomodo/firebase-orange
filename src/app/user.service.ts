import { Injectable, inject } from '@angular/core';
import { Auth, User, user, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '@angular/fire/auth';
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
    this.userSubscription = this.user$.subscribe((thisUser: User | null) => {
      // Fires off when user authentication state changes
      console.log('userSubscription changed in UserService:', thisUser);
    });
  }

  ngOnInit(): void {  
    // example use of onAuthStateChanged()
    onAuthStateChanged(this.auth, (user) => {
      console.log('onAuthStateChanged() executed');
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
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
