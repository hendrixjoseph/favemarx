import { Component } from '@angular/core';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css']
})
export class MainComponent {
  loggedin = false;

  onLogin() {
    this.loggedin = true;
  }

  onLogout() {
    this.loggedin = false;
  }
}
