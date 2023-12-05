import { CommonModule } from '@angular/common';
import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

import { Auth, authState, signInAnonymously, signOut, User, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword } from '@angular/fire/auth';


import { UserService } from '../user.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  whichForm = 'neither';
  authForm: FormGroup;
  signupForm: FormGroup;
  showUserDetails = false;

  currentAuth: Auth | undefined;

  // thisUser$: Observable<any> = this.userService.user$;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    @Optional() private auth: Auth,
  ) {
    // Set up Reactive SignUp/SignIn forms
    this.authForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    this.signupForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Subscribe to the user from UserService
    // this.thisUser$.subscribe(thisUser => console.log('thisUser is', thisUser));
    this.currentAuth = getAuth();
    console.log('currentAuth is', this.currentAuth);
    onAuthStateChanged(this.auth, (user) => {
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

  toggleUserDetails() {
    this.showUserDetails = !this.showUserDetails;
  }

  onSubmitLogin() {
    if (this.authForm.valid) {
      this.userService.signIn(
        this.authForm.value.username,
        this.authForm.value.password
      );
    }
  }

  onSubmitSignup() {
    if (this.signupForm.valid) {
      this.userService.signIn(
        this.signupForm.value.username,
        this.signupForm.value.password
      );
    }
  }

  logOut() {
    this.userService.signOut();
  }
}