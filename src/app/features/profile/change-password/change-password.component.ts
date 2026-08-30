import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/core/services/auth.service';
import { ChangePasswordRequest } from 'src/app/core/models/change-password-request';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {

  // ==========================================================
  // FORM FIELDS
  // ==========================================================

  currentPassword: string = '';
  newPassword: string = '';
  confirmPassword: string = '';

  // ==========================================================
  // UI STATE
  // ==========================================================

  showCurrentPassword: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  isSaving: boolean = false;

  successMessage: string = '';
  errorMessage: string = '';

  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  // ==========================================================
  // CHANGE PASSWORD
  // ==========================================================

  changePassword(): void {

    this.successMessage = '';
    this.errorMessage = '';

    // --------------------------------------------------------
    // BASIC VALIDATION
    // --------------------------------------------------------

    if (!this.currentPassword ||
        !this.newPassword ||
        !this.confirmPassword) {

      this.errorMessage = 'Please fill in all password fields.';
      return;
    }

    if (this.newPassword.length < 6) {

      this.errorMessage =
        'New password must be at least 6 characters long.';

      return;
    }

    if (this.newPassword !== this.confirmPassword) {

      this.errorMessage =
        'New password and confirm password do not match.';

      return;
    }

    if (this.currentPassword === this.newPassword) {

      this.errorMessage =
        'New password must be different from your current password.';

      return;
    }

    // --------------------------------------------------------
    // REQUEST
    // --------------------------------------------------------

    const request: ChangePasswordRequest = {

      currentPassword: this.currentPassword,

      newPassword: this.newPassword,

      confirmPassword: this.confirmPassword

    };

    this.isSaving = true;

    // --------------------------------------------------------
    // API CALL
    // --------------------------------------------------------

    this.authService.changePassword(request).subscribe({

      next: (response: string) => {

        this.isSaving = false;

        this.successMessage =
          response || 'Password changed successfully.';

        // Clear fields
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';

      },

      error: (error) => {

        this.isSaving = false;

        if (error?.error) {

          if (typeof error.error === 'string') {
            this.errorMessage = error.error;
          } else if (error.error.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage =
              'Unable to change password. Please try again.';
          }

        } else {

          this.errorMessage =
            'Unable to change password. Please try again.';

        }

      }

    });

  }

  // ==========================================================
  // PASSWORD VISIBILITY
  // ==========================================================

  toggleCurrentPassword(): void {

    this.showCurrentPassword = !this.showCurrentPassword;

  }

  toggleNewPassword(): void {

    this.showNewPassword = !this.showNewPassword;

  }

  toggleConfirmPassword(): void {

    this.showConfirmPassword = !this.showConfirmPassword;

  }

  // ==========================================================
  // PASSWORD STRENGTH
  // ==========================================================

  getPasswordStrength(): number {

    if (!this.newPassword) {
      return 0;
    }

    let score = 0;

    if (this.newPassword.length >= 6) {
      score += 25;
    }

    if (this.newPassword.length >= 10) {
      score += 25;
    }

    if (/[A-Z]/.test(this.newPassword)) {
      score += 15;
    }

    if (/[a-z]/.test(this.newPassword)) {
      score += 10;
    }

    if (/[0-9]/.test(this.newPassword)) {
      score += 15;
    }

    if (/[^A-Za-z0-9]/.test(this.newPassword)) {
      score += 10;
    }

    return Math.min(score, 100);
  }

  getPasswordStrengthLabel(): string {

    const strength = this.getPasswordStrength();

    if (strength === 0) {
      return 'Enter a password';
    }

    if (strength < 40) {
      return 'Weak';
    }

    if (strength < 70) {
      return 'Medium';
    }

    if (strength < 90) {
      return 'Strong';
    }

    return 'Very Strong';

  }

  // ==========================================================
  // CLEAR MESSAGES
  // ==========================================================

  clearSuccess(): void {

    this.successMessage = '';

  }

  clearError(): void {

    this.errorMessage = '';

  }

  // ==========================================================
  // BACK TO PROFILE
  // ==========================================================

  goBackToProfile(): void {

    this.router.navigate(['/admin/profile']);

  }

}