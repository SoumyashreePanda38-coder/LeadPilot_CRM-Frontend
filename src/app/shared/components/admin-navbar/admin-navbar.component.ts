import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent implements OnInit {

  /**
   * Sidebar Toggle Event
   */
  @Output()
  sidebarToggle = new EventEmitter<void>();

  /**
   * Theme
   */
  isDarkTheme = true;

  /**
   * Logged-in User
   */
  userName = '';

  role = '';

  profileImage = '';

  /**
   * Greeting
   */
  greeting = '';

  /**
   * Search
   */
  searchText = '';

  /**
   * Notification Count
   */
  notificationCount = 3;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.loadTheme();

    this.loadUser();

    this.setGreeting();

  }

  /**
   * Load Saved Theme
   */
  loadTheme(): void {

    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {

      this.isDarkTheme = false;

      document.body.classList.add('light-theme');
      document.body.classList.remove('dark-theme');

    } else {

      this.isDarkTheme = true;

      document.body.classList.add('dark-theme');
      document.body.classList.remove('light-theme');

    }

  }

  /**
   * Load Logged-in User
   */
  loadUser(): void {

    const user = localStorage.getItem('user');

    if (user) {

      const data = JSON.parse(user);

      this.userName = data.fullName;

      this.role = data.role;

      this.profileImage = data.profileImage;

    }

  }

  /**
   * Greeting
   */
  setGreeting(): void {

    const hour = new Date().getHours();

    if (hour < 12) {

      this.greeting = 'Good Morning';

    }

    else if (hour < 17) {

      this.greeting = 'Good Afternoon';

    }

    else {

      this.greeting = 'Good Evening';

    }

  }

  /**
   * Sidebar Toggle
   */
  toggleSidebar(): void {

    this.sidebarToggle.emit();

  }

  /**
   * Theme Toggle
   */
  toggleTheme(): void {

    this.isDarkTheme = !this.isDarkTheme;

    if (this.isDarkTheme) {

      document.body.classList.add('dark-theme');

      document.body.classList.remove('light-theme');

      localStorage.setItem('theme', 'dark');

    }

    else {

      document.body.classList.add('light-theme');

      document.body.classList.remove('dark-theme');

      localStorage.setItem('theme', 'light');

    }

  }

  /**
   * Search
   */
  search(): void {

    console.log('Searching:', this.searchText);

    // Future:
    // Connect to Lead Search API

  }

  /**
   * Notifications
   */
  openNotifications(): void {

    console.log('Notifications Clicked');

  }

  /**
   * Profile
   */
  openProfile(): void {

    this.router.navigate(['/admin/profile']);

  }

  /**
   * Logout
   */
  logout(): void {

    this.authService.logout().subscribe({

      next: () => {

        localStorage.removeItem('user');

        this.router.navigate(['/auth/login']);

      },

      error: () => {

        localStorage.removeItem('user');

        this.router.navigate(['/auth/login']);

      }

    });

  }

}