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
      this.userService.signIn(
        this.authForm.value.username,
        this.authForm.value.password
      );
    }
  }

  onSubmitSignup() {
    if (this.signupForm.valid) {
      const username = this.signupForm.value.username;
      const password = this.signupForm.value.password;
      console.log(`Signing up with username ${username} and password ${password}`);
      if (!username || !password) {
        console.error('user service signUp() email or password is empty');
        return;
      }
      this.userService.signUp(username, password);
    }
  }
}