import {
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  Subscription,
  interval
} from 'rxjs';

import {
  ReminderResponse
} from '../../../core/models/reminder-response';

import {
  ReminderService
} from '../../../core/services/reminder.service';


/**
 * ==========================================================
 * COMPONENT : ReminderListComponent
 * ==========================================================
 *
 * Displays CRM reminders generated automatically from
 * follow-ups.
 *
 * IMPORTANT:
 *
 * This component does NOT create reminders.
 *
 * Follow-Up
 *     ↓
 * Backend automatically creates Reminder
 *     ↓
 * ReminderService
 *     ↓
 * ReminderListComponent
 *
 * Responsibilities:
 *
 * - Load reminders
 * - Show unread reminders
 * - Show pending reminders
 * - Show upcoming reminders
 * - Show due reminders
 * - Mark reminder as read
 * - Complete reminder
 * - Dismiss reminder
 * - Restore dismissed reminder
 * - Periodically refresh reminders
 *
 * ==========================================================
 */

@Component({
  selector: 'app-reminder-list',

  templateUrl:
    './reminder-list.component.html',

  styleUrls: [
    './reminder-list.component.css'
  ]
})
export class ReminderListComponent
  implements OnInit, OnDestroy {


  // ==========================================================
  // REMINDERS
  // ==========================================================

  reminders: ReminderResponse[] = [];

  filteredReminders: ReminderResponse[] = [];


  // ==========================================================
  // ACTIVE FILTER
  // ==========================================================

  activeFilter:
    | 'ALL'
    | 'UNREAD'
    | 'PENDING'
    | 'UPCOMING'
    | 'DUE'
    | 'COMPLETED'
    | 'DISMISSED' = 'ALL';


  // ==========================================================
  // UI STATE
  // ==========================================================

  isLoading = false;

  isRefreshing = false;

  errorMessage = '';

  successMessage = '';


  // ==========================================================
  // NOTIFICATION STATE
  // ==========================================================

  showNotification = false;

  latestNotification:
    ReminderResponse | null = null;


  // ==========================================================
  // AUTO REFRESH
  // ==========================================================

  private refreshSubscription:
    Subscription | null = null;


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(
    private reminderService:
      ReminderService
  ) {}


  // ==========================================================
  // ON INIT
  // ==========================================================

  ngOnInit(): void {

    this.loadReminders();

    /*
     * Check for newly generated reminders periodically.
     *
     * Every 30 seconds the backend is checked again.
     *
     * This means:
     *
     * Follow-up created
     *        ↓
     * Backend creates reminder
     *        ↓
     * Angular refreshes
     *        ↓
     * Reminder appears
     *
     */

    this.refreshSubscription =
      interval(30000)
        .subscribe(() => {

          this.refreshReminders();

        });

  }


  // ==========================================================
  // ON DESTROY
  // ==========================================================

  ngOnDestroy(): void {

    if (this.refreshSubscription) {

      this.refreshSubscription.unsubscribe();

    }

  }


  // ==========================================================
  // LOAD ALL REMINDERS
  // ==========================================================

  loadReminders(): void {

    this.isLoading = true;

    this.errorMessage = '';


    this.reminderService
      .getAllReminders()
      .subscribe({

        next: (
          response: ReminderResponse[]
        ) => {

          const previousIds =
            this.reminders.map(
              reminder =>
                reminder.reminderId
            );


          this.reminders =
            response || [];


          /*
           * Detect newly arrived reminders.
           */

          const newReminder =
            this.reminders.find(
              reminder =>
                reminder.reminderId != null &&
                !previousIds.includes(
                  reminder.reminderId
                ) &&
                !reminder.read &&
                !reminder.dismissed
            );


          if (newReminder) {

            this.showNewNotification(
              newReminder
            );

          }


          this.applyFilter();

          this.isLoading = false;

        },

        error: (error) => {

          console.error(
            'Failed to load reminders:',
            error
          );

          this.isLoading = false;

          this.errorMessage =
            error?.error?.message ||
            'Unable to load reminders. Please try again.';

        }

      });

  }


  // ==========================================================
  // REFRESH REMINDERS
  // ==========================================================

  refreshReminders(): void {

    this.isRefreshing = true;


    this.reminderService
      .getAllReminders()
      .subscribe({

        next: (
          response: ReminderResponse[]
        ) => {

          const previousIds =
            this.reminders.map(
              reminder =>
                reminder.reminderId
            );


          this.reminders =
            response || [];


          /*
           * Check whether backend generated
           * a new reminder.
           */

          const newReminder =
            this.reminders.find(
              reminder =>
                reminder.reminderId != null &&
                !previousIds.includes(
                  reminder.reminderId
                ) &&
                !reminder.read &&
                !reminder.dismissed
            );


          if (newReminder) {

            this.showNewNotification(
              newReminder
            );

          }


          this.applyFilter();

          this.isRefreshing = false;

        },

        error: (error) => {

          console.error(
            'Failed to refresh reminders:',
            error
          );

          this.isRefreshing = false;

        }

      });

  }


  // ==========================================================
  // APPLY FILTER
  // ==========================================================

  applyFilter(): void {

    switch (this.activeFilter) {

      case 'UNREAD':

        this.filteredReminders =
          this.reminders.filter(
            reminder =>
              !reminder.read &&
              !reminder.dismissed
          );

        break;


      case 'PENDING':

        this.filteredReminders =
          this.reminders.filter(
            reminder =>
              !reminder.completed &&
              !reminder.dismissed
          );

        break;


      case 'UPCOMING':

        this.filteredReminders =
          this.reminders.filter(
            reminder =>
              !reminder.completed &&
              !reminder.dismissed &&
              this.getReminderDate(
                reminder
              ).getTime() > Date.now()
          );

        break;


      case 'DUE':

        this.filteredReminders =
          this.reminders.filter(
            reminder =>
              !reminder.completed &&
              !reminder.dismissed &&
              this.getReminderDate(
                reminder
              ).getTime() <= Date.now()
          );

        break;


      case 'COMPLETED':

        this.filteredReminders =
          this.reminders.filter(
            reminder =>
              reminder.completed
          );

        break;


      case 'DISMISSED':

        this.filteredReminders =
          this.reminders.filter(
            reminder =>
              reminder.dismissed
          );

        break;


      default:

        this.filteredReminders =
          [...this.reminders];

        break;

    }

  }


  // ==========================================================
  // CHANGE FILTER
  // ==========================================================

  setFilter(
    filter:
      | 'ALL'
      | 'UNREAD'
      | 'PENDING'
      | 'UPCOMING'
      | 'DUE'
      | 'COMPLETED'
      | 'DISMISSED'
  ): void {

    this.activeFilter = filter;

    this.applyFilter();

  }


  // ==========================================================
  // MARK AS READ
  // ==========================================================

  markAsRead(
    reminder: ReminderResponse
  ): void {

    if (
      reminder.read ||
      !reminder.reminderId
    ) {

      return;

    }


    this.reminderService
      .markAsRead(
        reminder.reminderId
      )
      .subscribe({

        next: (
          updatedReminder: ReminderResponse
        ) => {

          this.updateReminderInList(
            updatedReminder
          );

        },

        error: (error) => {

          console.error(
            'Failed to mark reminder as read:',
            error
          );

        }

      });

  }


  // ==========================================================
  // COMPLETE REMINDER
  // ==========================================================

  completeReminder(
    reminder: ReminderResponse
  ): void {

    if (
      reminder.completed ||
      !reminder.reminderId
    ) {

      return;

    }


    this.reminderService
      .completeReminder(
        reminder.reminderId
      )
      .subscribe({

        next: (
          updatedReminder: ReminderResponse
        ) => {

          this.updateReminderInList(
            updatedReminder
          );

          this.successMessage =
            'Reminder completed successfully.';

          this.applyFilter();

          this.clearMessageAfterDelay();

        },

        error: (error) => {

          console.error(
            'Failed to complete reminder:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to complete reminder.';

        }

      });

  }


  // ==========================================================
  // DISMISS REMINDER
  // ==========================================================

  dismissReminder(
    reminder: ReminderResponse
  ): void {

    if (
      reminder.dismissed ||
      !reminder.reminderId
    ) {

      return;

    }


    this.reminderService
      .dismissReminder(
        reminder.reminderId
      )
      .subscribe({

        next: (
          updatedReminder: ReminderResponse
        ) => {

          this.updateReminderInList(
            updatedReminder
          );

          this.successMessage =
            'Reminder dismissed.';

          this.applyFilter();

          this.clearMessageAfterDelay();

        },

        error: (error) => {

          console.error(
            'Failed to dismiss reminder:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to dismiss reminder.';

        }

      });

  }


  // ==========================================================
  // RESTORE REMINDER
  // ==========================================================

  restoreReminder(
    reminder: ReminderResponse
  ): void {

    if (
      !reminder.reminderId
    ) {

      return;

    }


    this.reminderService
      .restoreReminder(
        reminder.reminderId
      )
      .subscribe({

        next: (
          updatedReminder: ReminderResponse
        ) => {

          this.updateReminderInList(
            updatedReminder
          );

          this.successMessage =
            'Reminder restored.';

          this.applyFilter();

          this.clearMessageAfterDelay();

        },

        error: (error) => {

          console.error(
            'Failed to restore reminder:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to restore reminder.';

        }

      });

  }


  // ==========================================================
  // UPDATE LOCAL REMINDER
  // ==========================================================

  private updateReminderInList(
    updatedReminder: ReminderResponse
  ): void {

    const index =
      this.reminders.findIndex(
        reminder =>
          reminder.reminderId ===
          updatedReminder.reminderId
      );


    if (index !== -1) {

      this.reminders[index] =
        updatedReminder;

    }


    this.applyFilter();

  }


  // ==========================================================
  // SHOW NEW NOTIFICATION
  // ==========================================================

  private showNewNotification(
    reminder: ReminderResponse
  ): void {

    this.latestNotification =
      reminder;

    this.showNotification = true;


    /*
     * Automatically hide notification
     * after 8 seconds.
     */

    setTimeout(() => {

      this.showNotification = false;

    }, 8000);

  }


  // ==========================================================
  // CLOSE NOTIFICATION
  // ==========================================================

  closeNotification(): void {

    this.showNotification = false;

    this.latestNotification = null;

  }


  // ==========================================================
  // DATE CONVERSION
  // ==========================================================

  getReminderDate(
    reminder: ReminderResponse
  ): Date {

    return new Date(
      reminder.reminderAt
    );

  }


  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  formatDate(
    reminder: ReminderResponse
  ): string {

    if (!reminder.reminderAt) {

      return '-';

    }


    return this.getReminderDate(reminder)
      .toLocaleDateString(
        'en-IN',
        {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }
      );

  }


  // ==========================================================
  // FORMAT TIME
  // ==========================================================

  formatTime(
    reminder: ReminderResponse
  ): string {

    if (!reminder.reminderAt) {

      return '-';

    }


    return this.getReminderDate(reminder)
      .toLocaleTimeString(
        'en-IN',
        {
          hour: '2-digit',
          minute: '2-digit'
        }
      );

  }


  // ==========================================================
  // REMINDER STATUS
  // ==========================================================

  getReminderStatus(
    reminder: ReminderResponse
  ): string {

    if (reminder.dismissed) {

      return 'DISMISSED';

    }


    if (reminder.completed) {

      return 'COMPLETED';

    }


    if (
      this.getReminderDate(reminder)
        .getTime() <= Date.now()
    ) {

      return 'DUE';

    }


    return 'UPCOMING';

  }


  // ==========================================================
  // STATUS CLASS
  // ==========================================================

  getStatusClass(
    reminder: ReminderResponse
  ): string {

    return this.getReminderStatus(
      reminder
    ).toLowerCase();

  }


  // ==========================================================
  // GET ICON
  // ==========================================================

  getReminderIcon(
    reminder: ReminderResponse
  ): string {

    const status =
      this.getReminderStatus(reminder);


    if (status === 'COMPLETED') {

      return 'fa-solid fa-circle-check';

    }


    if (status === 'DISMISSED') {

      return 'fa-solid fa-ban';

    }


    if (status === 'DUE') {

      return 'fa-solid fa-bell';

    }


    return 'fa-solid fa-clock';

  }


  // ==========================================================
  // COUNTS
  // ==========================================================

  getTotalCount(): number {

    return this.reminders.length;

  }


  getUnreadCount(): number {

    return this.reminders.filter(
      reminder =>
        !reminder.read &&
        !reminder.dismissed
    ).length;

  }


  getPendingCount(): number {

    return this.reminders.filter(
      reminder =>
        !reminder.completed &&
        !reminder.dismissed
    ).length;

  }


  getDueCount(): number {

    return this.reminders.filter(
      reminder =>
        !reminder.completed &&
        !reminder.dismissed &&
        this.getReminderDate(
          reminder
        ).getTime() <= Date.now()
    ).length;

  }


  getCompletedCount(): number {

    return this.reminders.filter(
      reminder =>
        reminder.completed
    ).length;

  }


  // ==========================================================
  // CLEAR MESSAGE
  // ==========================================================

  private clearMessageAfterDelay(): void {

    setTimeout(() => {

      this.successMessage = '';

      this.errorMessage = '';

    }, 3000);

  }

}