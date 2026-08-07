import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent {

  /**
   * Sidebar Collapse State
   */
  @Input()
  collapsed: boolean = false;

  constructor(
    private router: Router
  ) { }

  /**
   * Navigate to Route
   */
  navigate(route: string): void {

    this.router.navigate([route]);

  }

  /**
   * Check Current Route
   * (Optional - useful if you want to manually highlight menus)
   */
  isCurrentRoute(route: string): boolean {

    return this.router.url.startsWith(route);

  }

}