import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Registration } from 'common/registration.js';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private httpClient: HttpClient) { }

  register(registration: Registration) {
    if (registration.password === registration.passwordAgain) {
      return this.httpClient.post('/register', registration);
    } else {
      throw 'passwords do not match';
    }
  }
}
