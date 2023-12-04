import { CommonModule } from '@angular/common';
import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Firestore } from '@angular/fire/firestore';
import { Auth, authState, signInAnonymously, signOut, User, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword } from '@angular/fire/auth';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  whichForm = 'neither';
  authForm!: FormGroup;
  signupForm!: FormGroup;
  currentAuth: Auth | undefined;
  showUserDetails = false;

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    @Optional() private auth: Auth
  ) { }

  ngOnInit(): void {
    // Set up forms
    this.authForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    this.signupForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });

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

  logOut() {
    signOut(this.auth).then(() => {
      console.log('User signed out');
    }).catch((error) => {
      console.error(error);
    });
  }

  onSubmitLogin() {
    if (this.authForm.valid) {
      console.log('Login Form values submitted:', this.authForm.value);

      signInWithEmailAndPassword(
        this.auth,
        this.authForm.value.username,
        this.authForm.value.password
      ).then((response: any) => {
        console.log('log in response', response);
        this.whichForm = 'neither';
      }).catch((error: any) => {
        console.error('log in error response', error);
      });
    }
  }

  onSubmitSignup() {
    if (this.signupForm.valid) {
      console.log('Signup Form values submitted:', this.signupForm.value);

      createUserWithEmailAndPassword(
        this.auth,
        this.signupForm.value.username,
        this.signupForm.value.password
      )
        .then((response: any) => {
          console.log(response);
          this.whichForm = 'neither';
        })
        .catch((error: any) => {
          console.error(error);
        });
    }
  }
}