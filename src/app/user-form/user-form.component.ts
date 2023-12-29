import { CommonModule } from '@angular/common';
import { Component, Optional } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '@angular/fire/auth';

import { UserService } from '../user.service';
import { LoginError } from '../models/models';

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
  showLoginError!: LoginError;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    @Optional() private auth: Auth
  ) {
    this.authForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    this.signupForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.userService.showLoginError$.subscribe((showLoginError) => {
      this.showLoginError = showLoginError;
    });
  }

  resetErrors() {
    this.userService.setShowLoginError(false, '');
  }

  onSubmitLogin() {
    this.userService.setShowLoginError(true, 'Please check email and password fields and try again.');
    if (this.authForm.touched || this.authForm.valid) {
      this.userService.signIn(
        this.authForm.value.email,
        this.authForm.value.password
      );
    }
  }

  onSubmitSignup() {
    console.log('onSubmitSignup()');
    this.userService.setShowLoginError(true, 'Please check email and password fields and try again.');
    if (this.signupForm.touched || this.signupForm.valid) {
      const email = this.signupForm.value.email;
      const password = this.signupForm.value.password;
      console.log(`Signing up with email ${email} and password ${password}`);
      if (!email || !password) {
        console.error('user service signUp() email or password is empty');
        this.userService.setShowLoginError(true, 'Email or Password is empty.  Please try again.');
        return;
      }
      this.userService.signUp(email, password);
    }
  }
}