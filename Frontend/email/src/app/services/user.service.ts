import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor(private api: ApiService) {}

  login(email: string, password: string) {
    const user: User = {
      email: email,
      password: password,
    };
    return this.api.login(user);
  }

  logout() {
    return this.api.logout();
  }

  signup(email: string, password: string) {
    const user: User = {
      email: email,
      password: password,
    };
    return this.api.signup(user);
  }
}
