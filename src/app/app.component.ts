import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'favemarx';
  page: 'login' | 'register' | 'bookmarks' = 'login';

  onLogin() {
    this.page = 'bookmarks';
  }

  onLogout() {
    this.page = 'login';
  }

  onRegister() {
    this.page = 'register';
  }
}
