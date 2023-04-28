import { Component, OnInit } from '@angular/core';
import { BookmarksFactoryService } from './bookmarks/bookmarks.factory.service';
import { LoginService } from './login/login.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent implements OnInit {
  loggedin = false;

  constructor(private bookmarksFactoryService: BookmarksFactoryService,
              private loginService: LoginService) {}

  ngOnInit(): void {
    this.loggedin = this.loginService.isLoggedIn();
  }

  onLogin() {
    this.bookmarksFactoryService.useDemo = false;
    this.loggedin = true;
  }

  onLogout() {
    this.loginService.logout()
    this.loggedin = false;
  }

  onDemo() {
    this.bookmarksFactoryService.useDemo = true;
    this.loggedin = true;
  }
}
