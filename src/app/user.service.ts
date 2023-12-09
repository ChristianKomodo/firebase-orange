import { Injectable, inject } from '@angular/core';
import { Auth, User, user, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { Firestore, collection, collectionData, doc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { NavigationService } from './navigation.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private auth: Auth = inject(Auth);
  user$ = user(this.auth);
  userSubscription: Subscription;
  // userData$: Observable<UserData>;  // ToDo: WHY DOES THIS NOT WORK?
  userData$: Observable<any>;

  constructor(
    private navigationService: NavigationService,
    private Firestore: Firestore
  ) {
    this.userSubscription = this.user$.subscribe((thisUser: User | null) => {
      // Navigate Home whenever user authentication state successfully changes
      // this.navigationService.navigateTo('home');
    });

    // const itemCollection = collection(this.firestore, 'test');
    // this.item$ = collectionData(itemCollection);

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

  signUp(email: string, password: string) {
    if (!email || !password) {
      console.error('user service signUp() email or password is empty');
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
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('user service signUp() error:', error);
        console.error('user service signUp() error message:', error.message);
      });
  }
  signIn(email: string, password: string) {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Successfully signed in
        console.log("user service signIn() userCredential is", userCredential);
        // Navigate Home after login
        this.navigationService.navigateTo('home');
      })
      .catch((error) => {
        // Failed to sign in
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error('user service signIn() error:', error.message);
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
    }).catch((error) => {
      console.log('User signOut() in UserService FAILED');
      console.error(error);
    });
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}
