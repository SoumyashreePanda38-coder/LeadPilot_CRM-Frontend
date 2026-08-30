import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/core/services/auth.service';
import { UserProfileResponse } from 'src/app/core/models/user-profile-response';
import { UserStatus } from 'src/app/core/models/user-status';
import { Role } from 'src/app/core/models/role';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  profile: UserProfileResponse | null = null;

  isLoading = false;

  errorMessage = '';

  successMessage = '';


  constructor(
    private authService: AuthService,
    private router: Router
  ) { }


  // ==========================================================
  // INITIALIZE
  // ==========================================================

  ngOnInit(): void {

    this.loadProfile();

  }


  // ==========================================================
  // LOAD PROFILE
  // ==========================================================

  loadProfile(): void {

    this.isLoading = true;

    this.errorMessage = '';

    this.authService.getProfile().subscribe({

      next: (response: UserProfileResponse) => {

        this.profile = response;

        this.isLoading = false;

      },

      error: (error) => {

        console.error('Profile loading failed:', error);

        this.errorMessage =
          'Unable to load your profile information.';

        this.isLoading = false;

      }

    });

  }


  // ==========================================================
  // REFRESH PROFILE
  // ==========================================================

  refreshProfile(): void {

    this.loadProfile();

  }


  // ==========================================================
  // CHANGE PASSWORD
  // ==========================================================

  goToChangePassword(): void {

    this.router.navigate([
      '/admin/profile/change-password'
    ]);

  }


  // ==========================================================
  // SECURITY SETTINGS
  // ==========================================================

  goToSecuritySettings(): void {

    this.router.navigate([
      '/admin/settings/security'
    ]);

  }


  // ==========================================================
  // PROFILE IMAGE
  // ==========================================================

  getProfileImage(): string {

    if (!this.profile?.profileImage) {

      return '';

    }

    return this.profile.profileImage;

  }


  // ==========================================================
  // UPLOAD PROFILE IMAGE
  // ==========================================================

  onProfileImageSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {

      return;

    }

    const file = input.files[0];


    // ------------------------------------------
    // Validate file type
    // ------------------------------------------

    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp'
    ];

    if (!allowedTypes.includes(file.type)) {

      this.errorMessage =
        'Please select a JPG, PNG or WEBP image.';

      return;

    }


    // ------------------------------------------
    // Validate file size
    // ------------------------------------------

    const maxSize =
      2 * 1024 * 1024;

    if (file.size > maxSize) {

      this.errorMessage =
        'Profile image must be smaller than 2 MB.';

      return;

    }


    // ------------------------------------------
    // Read image
    // ------------------------------------------

    const reader = new FileReader();

    reader.onload = () => {

      if (this.profile) {

        this.profile.profileImage =
          reader.result as string;

      }

      this.successMessage =
        'Profile image selected successfully.';

      this.errorMessage = '';

    };

    reader.onerror = () => {

      this.errorMessage =
        'Unable to read the selected image.';

    };

    reader.readAsDataURL(file);

  }


  // ==========================================================
  // INITIALS
  // ==========================================================

  getInitials(): string {

    if (!this.profile?.fullName) {

      return 'A';

    }

    return this.profile.fullName
      .split(' ')
      .filter(name => name.length > 0)
      .map(name => name.charAt(0))
      .slice(0, 2)
      .join('')
      .toUpperCase();

  }


  // ==========================================================
  // ROLE LABEL
  // ==========================================================

  getRoleLabel(): string {

    if (!this.profile?.role) {

      return 'Administrator';

    }

    switch (this.profile.role) {

      case Role.ADMIN:
        return 'Administrator';

      case Role.EXECUTIVE:
        return 'Executive';

      default:
        return String(this.profile.role);

    }

  }


  // ==========================================================
  // STATUS CLASS
  // ==========================================================

  getStatusClass(): string {

    if (!this.profile?.status) {

      return 'status-inactive';

    }

    return this.profile.status === UserStatus.ACTIVE
      ? 'status-active'
      : 'status-inactive';

  }


  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  formatDate(date: string): string {

    if (!date) {

      return '—';

    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {

      return '—';

    }

    return parsedDate.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );

  }


  // ==========================================================
  // FORMAT DATE TIME
  // ==========================================================

  formatDateTime(date: string): string {

    if (!date) {

      return '—';

    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {

      return '—';

    }

    return parsedDate.toLocaleString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    );

  }


  // ==========================================================
  // CLEAR ERROR
  // ==========================================================

  clearError(): void {

    this.errorMessage = '';

  }


  // ==========================================================
  // CLEAR SUCCESS
  // ==========================================================

  clearSuccess(): void {

    this.successMessage = '';

  }

}