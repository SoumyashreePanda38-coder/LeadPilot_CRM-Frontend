import {
  Component,
  OnInit
} from '@angular/core';


/**
 * ==========================================================
 * COMPONENT : SecuritySettingsComponent
 *
 * Description :
 * Admin security and authentication preferences.
 *
 * Includes:
 *
 * - Password security
 * - Session timeout
 * - Login protection
 * - Account lockout
 * - Two-factor authentication preference
 * - Security notifications
 * - Device/session monitoring
 *
 * ==========================================================
 */

@Component({
  selector: 'app-security-settings',

  templateUrl:
    './security-settings.component.html',

  styleUrls: [
    './security-settings.component.css'
  ]
})
export class SecuritySettingsComponent
  implements OnInit {


  // ==========================================================
  // UI STATE
  // ==========================================================

  isSaving = false;

  successMessage = '';

  errorMessage = '';


  // ==========================================================
  // PASSWORD SECURITY
  // ==========================================================

  minimumPasswordLength = 8;

  requireUppercase = true;

  requireLowercase = true;

  requireNumber = true;

  requireSpecialCharacter = true;

  passwordExpiry = false;

  passwordExpiryDays = 90;


  // ==========================================================
  // LOGIN SECURITY
  // ==========================================================

  maxLoginAttempts = 5;

  lockoutDuration = 15;

  accountLockout = true;


  // ==========================================================
  // TWO FACTOR AUTHENTICATION
  // ==========================================================

  twoFactorAuthentication = false;

  requireTwoFactorForAdmins = false;


  // ==========================================================
  // SESSION SECURITY
  // ==========================================================

  sessionTimeout = 30;

  rememberLogin = false;

  logoutOnBrowserClose = false;


  // ==========================================================
  // SECURITY NOTIFICATIONS
  // ==========================================================

  loginNotifications = true;

  passwordChangeNotifications = true;

  suspiciousActivityNotifications = true;


  // ==========================================================
  // SESSION MONITORING
  // ==========================================================

  sessionMonitoring = true;


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor() {}


  // ==========================================================
  // ON INIT
  // ==========================================================

  ngOnInit(): void {

    this.loadSettings();

  }


  // ==========================================================
  // LOAD SETTINGS
  // ==========================================================

  loadSettings(): void {

    /*
     * --------------------------------------------------------
     * TEMPORARY FRONTEND DEFAULTS
     * --------------------------------------------------------
     *
     * Later this method can call:
     *
     * GET /api/admin/settings/security
     *
     * --------------------------------------------------------
     */

    console.log(
      'Security settings loaded.'
    );

  }


  // ==========================================================
  // TOGGLE SETTING
  // ==========================================================

  toggleSetting(
    setting:
      | 'accountLockout'
      | 'twoFactorAuthentication'
      | 'requireTwoFactorForAdmins'
      | 'passwordExpiry'
      | 'rememberLogin'
      | 'logoutOnBrowserClose'
      | 'loginNotifications'
      | 'passwordChangeNotifications'
      | 'suspiciousActivityNotifications'
      | 'sessionMonitoring'
  ): void {

    switch (setting) {

      case 'accountLockout':

        this.accountLockout =
          !this.accountLockout;

        break;


      case 'twoFactorAuthentication':

        this.twoFactorAuthentication =
          !this.twoFactorAuthentication;

        break;


      case 'requireTwoFactorForAdmins':

        this.requireTwoFactorForAdmins =
          !this.requireTwoFactorForAdmins;

        break;


      case 'passwordExpiry':

        this.passwordExpiry =
          !this.passwordExpiry;

        break;


      case 'rememberLogin':

        this.rememberLogin =
          !this.rememberLogin;

        break;


      case 'logoutOnBrowserClose':

        this.logoutOnBrowserClose =
          !this.logoutOnBrowserClose;

        break;


      case 'loginNotifications':

        this.loginNotifications =
          !this.loginNotifications;

        break;


      case 'passwordChangeNotifications':

        this.passwordChangeNotifications =
          !this.passwordChangeNotifications;

        break;


      case 'suspiciousActivityNotifications':

        this.suspiciousActivityNotifications =
          !this.suspiciousActivityNotifications;

        break;


      case 'sessionMonitoring':

        this.sessionMonitoring =
          !this.sessionMonitoring;

        break;

    }

  }


  // ==========================================================
  // SAVE SETTINGS
  // ==========================================================

  saveSettings(): void {

    if (this.isSaving) {

      return;

    }


    // --------------------------------------------------------
    // CLEAR MESSAGES
    // --------------------------------------------------------

    this.successMessage = '';

    this.errorMessage = '';


    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (
      this.minimumPasswordLength < 6 ||
      this.minimumPasswordLength > 32
    ) {

      this.errorMessage =
        'Password length must be between 6 and 32 characters.';

      return;

    }


    if (
      this.maxLoginAttempts < 1 ||
      this.maxLoginAttempts > 20
    ) {

      this.errorMessage =
        'Login attempts must be between 1 and 20.';

      return;

    }


    if (
      this.sessionTimeout < 5 ||
      this.sessionTimeout > 1440
    ) {

      this.errorMessage =
        'Session timeout must be between 5 minutes and 24 hours.';

      return;

    }


    // --------------------------------------------------------
    // START SAVING
    // --------------------------------------------------------

    this.isSaving = true;


    /*
     * --------------------------------------------------------
     * TEMPORARY SAVE
     * --------------------------------------------------------
     *
     * Replace this block later with:
     *
     * this.securitySettingsService
     *   .updateSettings(...)
     *
     * --------------------------------------------------------
     */

    setTimeout(() => {

      this.isSaving = false;

      this.successMessage =
        'Security settings saved successfully.';

      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });


      setTimeout(() => {

        this.successMessage = '';

      }, 3500);

    }, 700);

  }


  // ==========================================================
  // RESET SETTINGS
  // ==========================================================

  resetSettings(): void {

    this.minimumPasswordLength = 8;

    this.requireUppercase = true;

    this.requireLowercase = true;

    this.requireNumber = true;

    this.requireSpecialCharacter = true;

    this.passwordExpiry = false;

    this.passwordExpiryDays = 90;

    this.maxLoginAttempts = 5;

    this.lockoutDuration = 15;

    this.accountLockout = true;

    this.twoFactorAuthentication = false;

    this.requireTwoFactorForAdmins = false;

    this.sessionTimeout = 30;

    this.rememberLogin = false;

    this.logoutOnBrowserClose = false;

    this.loginNotifications = true;

    this.passwordChangeNotifications = true;

    this.suspiciousActivityNotifications = true;

    this.sessionMonitoring = true;


    this.successMessage =
      'Security settings restored to defaults.';

    this.errorMessage = '';

  }


  // ==========================================================
  // CLEAR SUCCESS
  // ==========================================================

  clearSuccess(): void {

    this.successMessage = '';

  }


  // ==========================================================
  // CLEAR ERROR
  // ==========================================================

  clearError(): void {

    this.errorMessage = '';

  }


  // ==========================================================
  // PASSWORD SECURITY SCORE
  // ==========================================================

  getPasswordSecurityScore(): number {

    let score = 0;


    if (
      this.minimumPasswordLength >= 8
    ) {

      score += 20;

    }


    if (this.requireUppercase) {

      score += 20;

    }


    if (this.requireLowercase) {

      score += 20;

    }


    if (this.requireNumber) {

      score += 20;

    }


    if (this.requireSpecialCharacter) {

      score += 20;

    }


    return score;

  }


  // ==========================================================
  // PASSWORD SECURITY LABEL
  // ==========================================================

  getPasswordSecurityLabel(): string {

    const score =
      this.getPasswordSecurityScore();


    if (score >= 80) {

      return 'Strong';

    }


    if (score >= 60) {

      return 'Good';

    }


    if (score >= 40) {

      return 'Moderate';

    }


    return 'Weak';

  }


  // ==========================================================
  // SECURITY STATUS
  // ==========================================================

  getSecurityStatus(): string {

    if (
      this.twoFactorAuthentication &&
      this.accountLockout &&
      this.suspiciousActivityNotifications
    ) {

      return 'HIGH';

    }


    if (
      this.accountLockout ||
      this.suspiciousActivityNotifications
    ) {

      return 'MEDIUM';

    }


    return 'LOW';

  }

}