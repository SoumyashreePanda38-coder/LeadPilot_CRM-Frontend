import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {

  /**
   * Sidebar Collapse State
   */
  sidebarCollapsed: boolean = false;

  /**
   * Current Page Title
   */
  pageTitle: string = 'Dashboard';

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {

    // Future Enhancements:
    // ----------------------------
    // Load Logged-in User
    // Load Notifications
    // Update Breadcrumb
    // Load Theme Preference
    // ----------------------------

  }

  /**
   * Toggle Sidebar
   */
  toggleSidebar(): void {

    this.sidebarCollapsed = !this.sidebarCollapsed;

  }

  /**
   * Expand Sidebar
   */
  openSidebar(): void {

    this.sidebarCollapsed = false;

  }

  /**
   * Collapse Sidebar
   */
  closeSidebar(): void {

    this.sidebarCollapsed = true;

  }

  /**
   * Change Page Title
   */
  setPageTitle(title: string): void {

    this.pageTitle = title;

  }

  /**
   * Navigate to Dashboard
   */
  goToDashboard(): void {

    this.router.navigate(['/admin/dashboard']);

  }

}