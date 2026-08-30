import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-general-settings',
  templateUrl: './general-settings.component.html',
  styleUrls: ['./general-settings.component.css']
})
export class GeneralSettingsComponent implements OnInit {

  // ==========================================================
  // GENERAL SETTINGS
  // ==========================================================

  crmName: string = 'LeadPilot CRM';

  timezone: string = 'Asia/Kolkata';

  dateFormat: string = 'dd MMM yyyy';

  timeFormat: string = '12-hour';

  // ==========================================================
  // FOLLOW-UP SETTINGS
  // ==========================================================

  defaultFollowUpDuration: number = 30;

  reminderBeforeMinutes: number = 30;

  autoCreateReminder: boolean = true;

  // ==========================================================
  // NOTIFICATION SETTINGS
  // ==========================================================

  browserNotifications: boolean = true;

  inAppNotifications: boolean = true;

  emailNotifications: boolean = false;

  soundNotifications: boolean = true;

  // ==========================================================
  // REMINDER SETTINGS
  // ==========================================================

  autoRefreshReminders: boolean = true;

  refreshInterval: number = 30;

  showOverdueReminders: boolean = true;

  // ==========================================================
  // DISPLAY SETTINGS
  // ==========================================================

  listDensity: string = 'comfortable';

  showCompletedFollowUps: boolean = true;

  // ==========================================================
  // UI STATE
  // ==========================================================

  isSaving: boolean = false;

  successMessage: string = '';

  errorMessage: string = '';

  // ==========================================================
  // LIFECYCLE
  // ==========================================================

  ngOnInit(): void {
    this.loadSettings();
  }

  // ==========================================================
  // LOAD SETTINGS
  // ==========================================================

  loadSettings(): void {

    const savedSettings =
      localStorage.getItem('leadpilot_general_settings');

    if (!savedSettings) {
      return;
    }

    try {

      const settings = JSON.parse(savedSettings);

      this.crmName =
        settings.crmName ?? this.crmName;

      this.timezone =
        settings.timezone ?? this.timezone;

      this.dateFormat =
        settings.dateFormat ?? this.dateFormat;

      this.timeFormat =
        settings.timeFormat ?? this.timeFormat;

      this.defaultFollowUpDuration =
        settings.defaultFollowUpDuration ??
        this.defaultFollowUpDuration;

      this.reminderBeforeMinutes =
        settings.reminderBeforeMinutes ??
        this.reminderBeforeMinutes;

      this.autoCreateReminder =
        settings.autoCreateReminder ??
        this.autoCreateReminder;

      this.browserNotifications =
        settings.browserNotifications ??
        this.browserNotifications;

      this.inAppNotifications =
        settings.inAppNotifications ??
        this.inAppNotifications;

      this.emailNotifications =
        settings.emailNotifications ??
        this.emailNotifications;

      this.soundNotifications =
        settings.soundNotifications ??
        this.soundNotifications;

      this.autoRefreshReminders =
        settings.autoRefreshReminders ??
        this.autoRefreshReminders;

      this.refreshInterval =
        settings.refreshInterval ??
        this.refreshInterval;

      this.showOverdueReminders =
        settings.showOverdueReminders ??
        this.showOverdueReminders;

      this.listDensity =
        settings.listDensity ??
        this.listDensity;

      this.showCompletedFollowUps =
        settings.showCompletedFollowUps ??
        this.showCompletedFollowUps;

    } catch (error) {

      console.error(
        'Unable to load general settings',
        error
      );

    }
  }

  // ==========================================================
  // SAVE SETTINGS
  // ==========================================================

  saveSettings(): void {

    this.isSaving = true;

    this.successMessage = '';
    this.errorMessage = '';

    const settings = {

      crmName: this.crmName,

      timezone: this.timezone,

      dateFormat: this.dateFormat,

      timeFormat: this.timeFormat,

      defaultFollowUpDuration:
        this.defaultFollowUpDuration,

      reminderBeforeMinutes:
        this.reminderBeforeMinutes,

      autoCreateReminder:
        this.autoCreateReminder,

      browserNotifications:
        this.browserNotifications,

      inAppNotifications:
        this.inAppNotifications,

      emailNotifications:
        this.emailNotifications,

      soundNotifications:
        this.soundNotifications,

      autoRefreshReminders:
        this.autoRefreshReminders,

      refreshInterval:
        this.refreshInterval,

      showOverdueReminders:
        this.showOverdueReminders,

      listDensity:
        this.listDensity,

      showCompletedFollowUps:
        this.showCompletedFollowUps
    };

    /*
     * For now settings are stored locally.
     *
     * Later this can be replaced with:
     *
     * settingsService.updateSettings(settings)
     *
     * connected to Spring Boot.
     */

    setTimeout(() => {

      localStorage.setItem(
        'leadpilot_general_settings',
        JSON.stringify(settings)
      );

      this.isSaving = false;

      this.successMessage =
        'General settings saved successfully.';

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });

      setTimeout(() => {
        this.successMessage = '';
      }, 4000);

    }, 500);

  }

  // ==========================================================
  // RESET SETTINGS
  // ==========================================================

  resetSettings(): void {

    this.crmName = 'LeadPilot CRM';

    this.timezone = 'Asia/Kolkata';

    this.dateFormat = 'dd MMM yyyy';

    this.timeFormat = '12-hour';

    this.defaultFollowUpDuration = 30;

    this.reminderBeforeMinutes = 30;

    this.autoCreateReminder = true;

    this.browserNotifications = true;

    this.inAppNotifications = true;

    this.emailNotifications = false;

    this.soundNotifications = true;

    this.autoRefreshReminders = true;

    this.refreshInterval = 30;

    this.showOverdueReminders = true;

    this.listDensity = 'comfortable';

    this.showCompletedFollowUps = true;

    this.successMessage =
      'Settings have been reset to default values.';

    this.errorMessage = '';

    setTimeout(() => {
      this.successMessage = '';
    }, 3000);
  }

  // ==========================================================
  // TOGGLE SETTING
  // ==========================================================

  toggleSetting(
    setting:
      | 'autoCreateReminder'
      | 'browserNotifications'
      | 'inAppNotifications'
      | 'emailNotifications'
      | 'soundNotifications'
      | 'autoRefreshReminders'
      | 'showOverdueReminders'
      | 'showCompletedFollowUps'
  ): void {

    this[setting] = !this[setting];

  }

}