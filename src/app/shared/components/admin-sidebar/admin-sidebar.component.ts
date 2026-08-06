import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-admin-sidebar',
  templateUrl: './admin-sidebar.component.html',
  styleUrls: ['./admin-sidebar.component.css']
})
export class AdminSidebarComponent implements OnInit {

  /**
   * Sidebar Collapse State
   */
  @Input()
  collapsed: boolean = false;

  /**
   * Lead Management Menu
   */
  leadMenuOpen: boolean = true;

  /**
   * Current Active Route
   */
  currentRoute: string = '';

  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {

    this.currentRoute = this.router.url;

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event: any) => {

        this.currentRoute = event.urlAfterRedirects;

      });

  }

  /**
   * Toggle Lead Management Menu
   */
  toggleLeadMenu(): void {

    this.leadMenuOpen = !this.leadMenuOpen;

  }

  /**
   * Check Active Route
   */
  isActive(route: string): boolean {

    return this.currentRoute.startsWith(route);

  }

  /**
   * Navigate
   */
  navigate(route: string): void {

    this.router.navigate([route]);

  }

}