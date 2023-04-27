import { Component } from '@angular/core';
import { BookmarksFactoryService } from './bookmarks/bookmarks-factory.service';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  loggedin = false;

  constructor(private bookmarksFactoryService: BookmarksFactoryService) {

  }

  onLogin() {
    this.bookmarksFactoryService.useDemo = false;
    this.loggedin = true;
  }

  onLogout() {
    this.loggedin = false;
  }

  onDemo() {
    this.bookmarksFactoryService.useDemo = true;
    this.loggedin = true;
  }
}
