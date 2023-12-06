import { CommonModule } from '@angular/common';
import { Component, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth, authState, signInAnonymously, signOut, User, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword } from '@angular/fire/auth';

import { UserService } from '../user.service';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent {
  whichForm = 'login';
  authForm: FormGroup;
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    @Optional() private auth: Auth
  ) {
    this.authForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    this.signupForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmitLogin() {
    if (this.authForm.valid) {
      // console.log('Login Form values submitted:', this.authForm.value);
      this.userService.signIn(this.authForm.value.username,
        this.authForm.value.password);
    }
  }

  onSubmitSignup() {
    if (this.signupForm.valid) {
      // console.log('Signup Form values submitted:', this.signupForm.value);
      this.userService.signUp(this.authForm.value.username,
        this.authForm.value.password);
    }
  }
}