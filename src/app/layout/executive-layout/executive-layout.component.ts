import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-executive-layout',
  templateUrl: './executive-layout.component.html',
  styleUrls: ['./executive-layout.component.css']
})
export class ExecutiveLayoutComponent {

  sidebarCollapsed = false;

  constructor(private router: Router) {}

  toggleSidebar(): void {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  goToDashboard(): void {
    this.router.navigate(['/executive/dashboard']);
  }
}
