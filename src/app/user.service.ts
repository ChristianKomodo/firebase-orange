import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private afAuth: Auth) { }

  get isAuthenticated(): boolean {
    return this.afAuth.currentUser !== null;
  }
}
