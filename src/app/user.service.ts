import { Injectable, inject } from '@angular/core';
import { Auth, User, user, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { BehaviorSubject } from 'rxjs';
import { Firestore, collection, collectionData, doc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { LoginError } from './models/models';
import { NavigationService } from './navigation.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private auth: Auth = inject(Auth);
  user$ = user(this.auth);
  // userData$: Observable<UserData>;  // ToDo: WHY DOES THIS NOT WORK?
  userData$: Observable<any>;
  private _showLoginError = new BehaviorSubject<LoginError>({ value: false, message: '' });
  showLoginError$ = this._showLoginError.asObservable();

  constructor(
    private navigationService: NavigationService,
    private Firestore: Firestore
  ) {
    const userCollection = collection(this.Firestore, 'users');
    this.userData$ = collectionData(userCollection);
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

  setShowLoginError(value: boolean, message: string) {
    this._showLoginError.next({ 'value': value, 'message': message });
  }

  signUp(email: string, password: string) {
    console.log('user service signUp()');
    if (!email || !password) {
      console.error('user service signUp() email or password is empty');
      this._showLoginError.next({
        value: true,
        message: 'Email or Password field is empty.  Please try again.'
      });
      return;
    }
    const auth = getAuth();
    console.log(`user service signUp() email is ${email} and password is ${password}`);
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Successfully signed up
        console.log("user service signUp() userCredential is", userCredential);
        // Make a User account for new users
        this.addUserData(userCredential.user);
      })
      .catch((error) => {
        // Failed to sign up
        console.error('user service signUp() error:', error);
        console.error('user service signUp() error message:', error.message);
        this._showLoginError.next({
          value: true,
          message: error.message
        });
      });
  }
  signIn(email: string, password: string) {
    this._showLoginError.next({
      value: false,
      message: ''
    });
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Successfully signed in
        console.log("user service signIn() userCredential is", userCredential);
        // Navigate Home after login
        this.navigationService.navigateTo('user-data');
      })
      .catch((error) => {
        // Failed to sign in
        console.error('user service signIn() error:', error);
        console.error('user service signIn() error message:', error.message);
        if (error.message.includes('auth/invalid-credential')) {
          console.log('INVALID CREDENTIALS');
          this._showLoginError.next({
            value: true,
            message: 'Invalid Credentials.  Please try again.'
          });
        }
      });
  }

  addUserData(user: User) {
    const userCollection = collection(this.Firestore, 'users');
    const userDoc = doc(userCollection, user.uid);
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL
    };
    setDoc(userDoc, userData).then(() => {
      console.log('user service addUserData() docRef is', userDoc);
    }).catch((error) => {
      console.error('user service addUserData() error:', error);
    });
  }

  signOut() {
    signOut(this.auth).then(() => {
      console.log('User signOut() in UserService');
      this.navigationService.navigateTo('user-form');
    }).catch((error) => {
      console.log('User signOut() in UserService FAILED');
      console.error(error);
    });
  }
}
