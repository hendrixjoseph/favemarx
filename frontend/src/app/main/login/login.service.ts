import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) { }

  login(email: string, password: string) {
    return this.httpClient.post('/login', {username: email, password: password}).pipe(
      tap(() => localStorage.setItem('loggedin', 'true'))
    );
  }

  logout() {
    localStorage.setItem('loggedin', 'false');
    this.httpClient.get('/logout').subscribe();
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('loggedin') === 'true';
  }
}
