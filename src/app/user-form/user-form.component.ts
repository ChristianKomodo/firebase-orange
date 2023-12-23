import { CommonModule } from '@angular/common';
import { Component, Optional } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Auth } from '@angular/fire/auth';

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
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
    this.signupForm = this.fb.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  onSubmitLogin() {
    if (this.authForm.valid) {
      this.userService.signIn(
        this.authForm.value.email,
        this.authForm.value.password
      );
    }
  }

  onSubmitSignup() {
    if (this.signupForm.valid) {
      const email = this.signupForm.value.email;
      const password = this.signupForm.value.password;
      console.log(`Signing up with email ${email} and password ${password}`);
      if (!email || !password) {
        console.error('user service signUp() email or password is empty');
        return;
      }
      this.userService.signUp(email, password);
    }
  }
}