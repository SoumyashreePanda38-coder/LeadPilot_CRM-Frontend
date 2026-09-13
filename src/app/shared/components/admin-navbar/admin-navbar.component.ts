import {
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';

import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';

import { ThemeService } from '../../../core/services/theme.service';

import { ReminderService } from '../../../core/services/reminder.service';


@Component({
  selector: 'app-admin-navbar',
  templateUrl: './admin-navbar.component.html',
  styleUrls: ['./admin-navbar.component.css']
})
export class AdminNavbarComponent implements OnInit {


  // =========================================================
  // Sidebar
  // =========================================================

  @Output()
  sidebarToggle = new EventEmitter<void>();


  // =========================================================
  // Theme
  // =========================================================

  /*
   * false = Light
   * true  = Dark
   *
   * Default application theme is LIGHT.
   */
  isDarkTheme: boolean = false;


  // =========================================================
  // Logged-in User
  // =========================================================

  userName: string = '';

  role: string = '';

  profileImage: string = '';


  // =========================================================
  // Logged-in User ID
  // =========================================================

  userId: number | null = null;


  // =========================================================
  // Greeting
  // =========================================================

  greeting: string = '';


  // =========================================================
  // Search
  // =========================================================

  searchText: string = '';


  // =========================================================
  // Notifications / Reminders
  // =========================================================

  /*
   * This is now loaded from the backend.
   *
   * It represents the number of unread reminders
   * assigned to the currently logged-in user.
   */
  notificationCount: number = 0;


  // =========================================================
  // Constructor
  // =========================================================

  constructor(
    private authService: AuthService,
    private router: Router,
    private themeService: ThemeService,
    private reminderService: ReminderService
  ) {}


  // =========================================================
  // Angular Lifecycle
  // =========================================================

  ngOnInit(): void {

    /*
     * Get the current GLOBAL theme.
     *
     * ThemeService is responsible for applying
     * light-theme / dark-theme to <body>.
     */
    this.isDarkTheme =
      this.themeService.isDarkTheme();


    this.loadUser();

    this.setGreeting();

  }


  // =========================================================
  // GLOBAL THEME
  // =========================================================

  toggleTheme(): void {

    /*
     * The navbar does NOT directly manipulate
     * document.body anymore.
     *
     * ThemeService controls the entire application.
     */
    this.themeService.toggleTheme();


    /*
     * Update navbar icon.
     */
    this.isDarkTheme =
      this.themeService.isDarkTheme();

  }


  // =========================================================
  // User
  // =========================================================

  loadUser(): void {

    const user =
      localStorage.getItem('user');


    if (!user) {

      return;
    }


    try {

      const data =
        JSON.parse(user);


      /*
       * User ID
       *
       * Supports both possible response field names:
       * id
       * userId
       */
      this.userId =
        data.id ??
        data.userId ??
        null;


      this.userName =
        data.fullName ?? '';


      this.role =
        data.role ?? '';


      this.profileImage =
        data.profileImage ?? '';


      /*
       * Load the actual unread reminder count
       * after identifying the logged-in user.
       */
      this.loadNotificationCount();


    } catch (error) {

      console.error(
        'Unable to load logged-in user:',
        error
      );

    }

  }


  // =========================================================
  // LOAD LIVE NOTIFICATION COUNT
  // =========================================================

  loadNotificationCount(): void {

    /*
     * No logged-in user ID means there is
     * nothing to count.
     */
    if (!this.userId) {

      this.notificationCount = 0;

      return;
    }


    /*
     * Get the number of unread reminders
     * assigned to the logged-in user.
     *
     * Backend:
     *
     * GET
     * /api/reminders/user/{userId}/unread/count
     */
    this.reminderService
      .getUnreadReminderCountByUser(this.userId)
      .subscribe({

        next: (count: number) => {

          this.notificationCount =
            count ?? 0;

        },

        error: (error) => {

          console.error(
            'Unable to load reminder notification count:',
            error
          );

          /*
           * Do not show a fake number if the API fails.
           */
          this.notificationCount = 0;

        }

      });

  }


  // =========================================================
  // Greeting
  // =========================================================

  setGreeting(): void {

    const hour =
      new Date().getHours();


    if (hour < 12) {

      this.greeting =
        'Good Morning';

    } else if (hour < 17) {

      this.greeting =
        'Good Afternoon';

    } else {

      this.greeting =
        'Good Evening';

    }

  }


  // =========================================================
  // Sidebar
  // =========================================================

  toggleSidebar(): void {

    this.sidebarToggle.emit();

  }


  // =========================================================
  // SEARCH
  // =========================================================

  search(): void {

    const search =
      this.searchText.trim();


    const value =
      search.toLowerCase();


    /*
     * Do nothing when search box is empty.
     */
    if (!search) {

      return;
    }


    // =======================================================
    // LEAD CATEGORY
    // =======================================================

    if (
      value.includes('lead category') ||
      value.includes('lead categories') ||
      value === 'category' ||
      value === 'categories'
    ) {

      this.router.navigate(
        ['/admin/lead-configuration/category'],
        {
          queryParams: {
            search: search
          }
        }
      );

      return;
    }


    // =======================================================
    // LEAD SUBCATEGORY
    // =======================================================

    if (
      value.includes('lead subcategory') ||
      value.includes('lead subcategories') ||
      value === 'subcategory' ||
      value === 'subcategories'
    ) {

      this.router.navigate(
        ['/admin/lead-configuration/subcategory'],
        {
          queryParams: {
            search: search
          }
        }
      );

      return;
    }


    // =======================================================
    // LEAD SOURCE
    // =======================================================

    if (
      value.includes('lead source') ||
      value.includes('lead sources') ||
      value === 'source' ||
      value === 'sources'
    ) {

      this.router.navigate(
        ['/admin/lead-configuration/source'],
        {
          queryParams: {
            search: search
          }
        }
      );

      return;
    }


    // =======================================================
    // FOLLOW UPS
    // =======================================================

    if (
      value.includes('followup') ||
      value.includes('follow-up') ||
      value.includes('follow up') ||
      value.includes('followups') ||
      value.includes('follow-ups')
    ) {

      this.router.navigate(
        ['/admin/followups'],
        {
          queryParams: {
            search: search
          }
        }
      );

      return;
    }


    // =======================================================
    // REMINDERS
    // =======================================================

    if (
      value.includes('reminder') ||
      value.includes('reminders')
    ) {

      this.router.navigate(
        ['/admin/reminders']
      );

      return;
    }


    // =======================================================
    // PROFILE
    // =======================================================

    if (
      value.includes('my profile') ||
      value.includes('profile')
    ) {

      this.router.navigate(
        ['/admin/profile']
      );

      return;
    }


    // =======================================================
    // EXECUTIVE MANAGEMENT
    // =======================================================

    if (
      value.includes('executive management') ||
      value.includes('executive') ||
      value.includes('executives') ||
      value.includes('employee') ||
      value.includes('employees') ||
      value.includes('user') ||
      value.includes('users')
    ) {

      this.router.navigate(
        ['/admin/users'],
        {
          queryParams: {
            search: search
          }
        }
      );

      return;
    }


    // =======================================================
    // SETTINGS
    // =======================================================

    if (
      value.includes('setting') ||
      value.includes('settings') ||
      value.includes('configuration settings')
    ) {

      this.router.navigate(
        ['/admin/settings']
      );

      return;
    }


    // =======================================================
    // CUSTOMER LEADS
    // =======================================================

    if (
      value.includes('customer lead') ||
      value.includes('customer leads') ||
      value === 'lead' ||
      value === 'leads' ||
      value === 'customer'
    ) {

      this.router.navigate(
        ['/admin/leads'],
        {
          queryParams: {
            search: search
          }
        }
      );

      return;
    }


    // =======================================================
    // DEFAULT SEARCH
    // =======================================================

    /*
     * If the search term does not match any
     * specific section, search inside Customer Leads.
     */
    this.router.navigate(
      ['/admin/leads'],
      {
        queryParams: {
          search: search
        }
      }
    );

  }


  // =========================================================
  // Logout
  // =========================================================

  logout(): void {

    this.authService.logout().subscribe({

      next: () => {

        localStorage.removeItem('user');

        this.router.navigate(
          ['/auth/login']
        );

      },

      error: () => {

        localStorage.removeItem('user');

        this.router.navigate(
          ['/auth/login']
        );

      }

    });

  }

}