import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface User {
  email: string;
  uuid: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _user: User | undefined;

  get user(): User | undefined {
    return this._user;
  }

  setUser(user: User) {
    this._user = user;
  }
}
