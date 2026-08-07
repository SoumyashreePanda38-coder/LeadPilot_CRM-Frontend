import {
  Component,
  HostListener,
  OnInit
} from '@angular/core';

import {
  NavigationEnd,
  Router
} from '@angular/router';

import { filter } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css']
})
export class AdminLayoutComponent implements OnInit {

  /**
   * ============================================
   * Drawer Sidebar State
   * --------------------------------------------
   * false -> Sidebar Hidden
   * true  -> Sidebar Visible
   * ============================================
   */
  sidebarOpened: boolean = false;

  /**
   * ============================================
   * Current Page Title
   * ============================================
   */
  pageTitle: string = 'Dashboard';

  constructor(
    private router: Router
  ) { }

  // =========================================================
  // Angular Lifecycle
  // =========================================================

  ngOnInit(): void {

    /**
     * Automatically close the sidebar whenever
     * the route changes.
     */
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {

        this.closeSidebar();

      });

  }

  // =========================================================
  // Sidebar Methods
  // =========================================================

  /**
   * Toggle Drawer Sidebar
   */
  toggleSidebar(): void {

    this.sidebarOpened = !this.sidebarOpened;

  }

  /**
   * Open Drawer Sidebar
   */
  openSidebar(): void {

    this.sidebarOpened = true;

  }

  /**
   * Close Drawer Sidebar
   */
  closeSidebar(): void {

    this.sidebarOpened = false;

  }

  /**
   * Close Sidebar when Overlay is clicked
   */
  closeSidebarOutside(): void {

    this.closeSidebar();

  }

  // =========================================================
  // Keyboard Events
  // =========================================================

  /**
   * Close Sidebar using ESC key
   */
  @HostListener('document:keydown.escape')
  onEscapePressed(): void {

    this.closeSidebar();

  }

  // =========================================================
  // Window Events
  // =========================================================

  /**
   * Close Sidebar whenever browser window is resized
   */
  @HostListener('window:resize')
  onWindowResize(): void {

    this.closeSidebar();

  }

  // =========================================================
  // Page Methods
  // =========================================================

  /**
   * Update Page Title
   */
  setPageTitle(title: string): void {

    this.pageTitle = title;

  }

  /**
   * Navigate to Dashboard
   */
  goToDashboard(): void {

    this.router.navigate([
      '/admin/dashboard'
    ]);

    this.closeSidebar();

  }

}