import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { UserManagementService } from '../../../core/services/user-management.service';
import { UserManagementResponse } from '../../../core/models/user-management-response';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.css']
})
export class ViewUserComponent implements OnInit {

  // ==========================================================
  // USER DATA
  // ==========================================================

  user: UserManagementResponse | null = null;

  // ==========================================================
  // UI STATE
  // ==========================================================

  isLoading = true;
  errorMessage = '';

  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userManagementService: UserManagementService
  ) {}

  // ==========================================================
  // INITIALIZE
  // ==========================================================

  ngOnInit(): void {
    this.loadUser();
  }

  // ==========================================================
  // LOAD USER
  // ==========================================================

  private loadUser(): void {

    const idParam = this.route.snapshot.paramMap.get('id');

    const userId = idParam ? Number(idParam) : NaN;

    if (!idParam || Number.isNaN(userId)) {

      this.errorMessage = 'Invalid executive ID.';
      this.isLoading = false;

      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.userManagementService
      .getExecutiveById(userId)
      .subscribe({

        next: (response: UserManagementResponse) => {

          this.user = response;

          this.isLoading = false;
        },

        error: (error) => {

          console.error(
            'Error loading executive:',
            error
          );

          this.isLoading = false;

          if (error.status === 401) {

            this.errorMessage =
              'Your session has expired. Please login again.';

          } else if (error.status === 403) {

            this.errorMessage =
              'You do not have permission to view this executive.';

          } else if (error.status === 404) {

            this.errorMessage =
              'Executive not found.';

          } else {

            this.errorMessage =
              'Unable to load executive details. Please try again.';
          }
        }
      });
  }

  // ==========================================================
  // EDIT USER
  // ==========================================================

  onEdit(): void {

    if (!this.user) {
      return;
    }

    this.router.navigate([
      '/admin/users/edit',
      this.user.id
    ]);
  }

  // ==========================================================
  // BACK
  // ==========================================================

  onBack(): void {

    this.router.navigate([
      '/admin/users'
    ]);
  }

  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  formatDate(date: string | null): string {

    if (!date) {
      return 'Not available';
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return 'Not available';
    }

    return parsedDate.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  // ==========================================================
  // STATUS CLASS
  // ==========================================================

  getStatusClass(): string {

    if (!this.user) {
      return '';
    }

    const status =
      String(this.user.status).toLowerCase();

    if (
      status === 'active' ||
      status === 'activated'
    ) {
      return 'status-active';
    }

    if (
      status === 'inactive' ||
      status === 'deactivated'
    ) {
      return 'status-inactive';
    }

    return 'status-default';
  }

  // ==========================================================
  // RETRY
  // ==========================================================

  retry(): void {
    this.loadUser();
  }
}