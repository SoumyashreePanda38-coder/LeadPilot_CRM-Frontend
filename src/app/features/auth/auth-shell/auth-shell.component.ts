import { Component } from '@angular/core';

@Component({
  selector: 'app-auth-shell',
  templateUrl: './auth-shell.component.html',
  styleUrls: ['./auth-shell.component.css']
})
export class AuthShellComponent {

  showRegister = false;

  showLogin(): void {
    this.showRegister = false;
  }

  showRegisterPanel(): void {
    this.showRegister = true;
  }
}