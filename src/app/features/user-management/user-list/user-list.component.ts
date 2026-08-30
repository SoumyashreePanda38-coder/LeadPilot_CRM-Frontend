import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserManagementService } from '../../../core/services/user-management.service';
import { UserManagementResponse } from '../../../core/models/user-management-response';
import { UserStatus } from 'src/app/core/models/user-status';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  readonly Math = Math;

String(value: any): string {
  return String(value);
}


  // ==========================================================
  // DATA
  // ==========================================================

  executives: UserManagementResponse[] = [];
  filteredExecutives: UserManagementResponse[] = [];

  // ==========================================================
  // UI STATE
  // ==========================================================

  isLoading = false;

  successMessage = '';
  errorMessage = '';

  searchText = '';

  selectedStatus = 'ALL';

  // ==========================================================
  // PAGINATION
  // ==========================================================

  currentPage = 1;
  pageSize = 8;

  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(
    private userManagementService: UserManagementService,
    private router: Router
  ) {}

  // ==========================================================
  // INITIALIZATION
  // ==========================================================

  ngOnInit(): void {
    this.loadExecutives();
  }

  // ==========================================================
  // LOAD ALL EXECUTIVES
  // ==========================================================

  loadExecutives(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.userManagementService.getAllExecutives().subscribe({

      next: (response: UserManagementResponse[]) => {

        this.executives = response || [];

        this.filteredExecutives = [...this.executives];

        this.currentPage = 1;

        this.applyFilters();

        this.isLoading = false;
      },

      error: (error) => {

        console.error(
          'Error loading executives:',
          error
        );

        this.isLoading = false;

        if (error.status === 401) {

          this.errorMessage =
            'Your session has expired. Please login again.';

        } else if (error.status === 403) {

          this.errorMessage =
            'You do not have permission to view executives.';

        } else {

          this.errorMessage =
            'Unable to load executive users. Please try again.';
        }
      }
    });
  }

  // ==========================================================
  // SEARCH
  // ==========================================================

  onSearch(): void {

    this.currentPage = 1;

    this.applyFilters();
  }

  // ==========================================================
  // STATUS FILTER
  // ==========================================================

  onStatusChange(): void {

    this.currentPage = 1;

    this.applyFilters();
  }

  // ==========================================================
  // APPLY SEARCH + STATUS FILTER
  // ==========================================================

  private applyFilters(): void {

    let results = [...this.executives];

    // --------------------------------------------------------
    // SEARCH
    // --------------------------------------------------------

    const search =
      this.searchText.trim().toLowerCase();

    if (search) {

      results = results.filter((user) => {

        return (

          (user.fullName || '')
            .toLowerCase()
            .includes(search)

          ||

          (user.username || '')
            .toLowerCase()
            .includes(search)

          ||

          (user.employeeId || '')
            .toLowerCase()
            .includes(search)

          ||

          (user.email || '')
            .toLowerCase()
            .includes(search)

          ||

          (user.phoneNumber || '')
            .toLowerCase()
            .includes(search)

          ||

          (user.designation || '')
            .toLowerCase()
            .includes(search)

          ||

          (user.department || '')
            .toLowerCase()
            .includes(search)
        );
      });
    }

    // --------------------------------------------------------
    // STATUS
    // --------------------------------------------------------

    if (this.selectedStatus !== 'ALL') {

      results = results.filter((user) => {

        return String(user.status).toUpperCase() ===
          this.selectedStatus;
      });
    }

    this.filteredExecutives = results;

    // Prevent page from exceeding available pages
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages || 1;
    }
  }

  // ==========================================================
  // TOTAL PAGES
  // ==========================================================

  get totalPages(): number {

    return Math.ceil(
      this.filteredExecutives.length / this.pageSize
    );
  }

  // ==========================================================
  // PAGINATED USERS
  // ==========================================================

  get paginatedExecutives(): UserManagementResponse[] {

    const startIndex =
      (this.currentPage - 1) * this.pageSize;

    const endIndex =
      startIndex + this.pageSize;

    return this.filteredExecutives.slice(
      startIndex,
      endIndex
    );
  }

  // ==========================================================
  // PAGINATION
  // ==========================================================

  goToPage(page: number): void {

    if (
      page < 1 ||
      page > this.totalPages
    ) {
      return;
    }

    this.currentPage = page;
  }

  nextPage(): void {

    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  previousPage(): void {

    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  // ==========================================================
  // PAGE NUMBERS
  // ==========================================================

  get pageNumbers(): number[] {

    const pages: number[] = [];

    for (
      let i = 1;
      i <= this.totalPages;
      i++
    ) {
      pages.push(i);
    }

    return pages;
  }

  // ==========================================================
  // ADD USER
  // ==========================================================

  addUser(): void {

    this.router.navigate([
      '/admin/users/add'
    ]);
  }

  // ==========================================================
  // VIEW USER
  // ==========================================================

  viewUser(id: number): void {

    this.router.navigate([
      '/admin/users/view',
      id
    ]);
  }

  // ==========================================================
  // EDIT USER
  // ==========================================================

  editUser(id: number): void {

    this.router.navigate([
      '/admin/users/edit',
      id
    ]);
  }

  // ==========================================================
  // ACTIVATE USER
  // ==========================================================

  activateUser(user: UserManagementResponse): void {

    const adminId = this.getAdminId();

    if (!adminId) {
      return;
    }

    this.clearMessages();

    this.userManagementService
      .activateExecutive(user.id, adminId)
      .subscribe({

        next: (updatedUser) => {

          this.updateUserInList(updatedUser);

          this.successMessage =
            `${user.fullName} has been activated successfully.`;

          this.autoClearSuccess();
        },

        error: (error) => {

          console.error(
            'Error activating executive:',
            error
          );

          this.errorMessage =
            this.getActionErrorMessage(error);
        }
      });
  }

  // ==========================================================
  // DEACTIVATE USER
  // ==========================================================

  deactivateUser(user: UserManagementResponse): void {

    const adminId = this.getAdminId();

    if (!adminId) {
      return;
    }

    this.clearMessages();

    this.userManagementService
      .deactivateExecutive(user.id, adminId)
      .subscribe({

        next: (updatedUser) => {

          this.updateUserInList(updatedUser);

          this.successMessage =
            `${user.fullName} has been deactivated successfully.`;

          this.autoClearSuccess();
        },

        error: (error) => {

          console.error(
            'Error deactivating executive:',
            error
          );

          this.errorMessage =
            this.getActionErrorMessage(error);
        }
      });
  }

  // ==========================================================
  // UPDATE USER IN CURRENT LIST
  // ==========================================================

  private updateUserInList(
    updatedUser: UserManagementResponse
  ): void {

    const index = this.executives.findIndex(
      user => user.id === updatedUser.id
    );

    if (index !== -1) {

      this.executives[index] = updatedUser;
    }

    this.applyFilters();
  }

  // ==========================================================
  // GET ADMIN ID
  // ==========================================================

  private getAdminId(): number | null {

    const storedUserId =
      localStorage.getItem('userId');

    const adminId =
      storedUserId
        ? Number(storedUserId)
        : null;

    if (
      !adminId ||
      Number.isNaN(adminId)
    ) {

      this.errorMessage =
        'Unable to identify the logged-in administrator. Please login again.';

      return null;
    }

    return adminId;
  }

  // ==========================================================
  // ERROR MESSAGE
  // ==========================================================

  private getActionErrorMessage(error: any): string {

    if (error.status === 401) {

      return 'Your session has expired. Please login again.';
    }

    if (error.status === 403) {

      return 'You do not have permission to perform this action.';
    }

    if (error.status === 404) {

      return 'Executive user was not found.';
    }

    return 'Unable to complete the requested action. Please try again.';
  }

  // ==========================================================
  // CLEAR MESSAGES
  // ==========================================================

  private clearMessages(): void {

    this.successMessage = '';
    this.errorMessage = '';
  }

  // ==========================================================
  // AUTO CLEAR SUCCESS
  // ==========================================================

  private autoClearSuccess(): void {

    setTimeout(() => {

      this.successMessage = '';

    }, 3000);
  }

  // ==========================================================
  // STATUS CLASS
  // ==========================================================

  getStatusClass(status: any): string {

    const value =
      String(status || '').toUpperCase();

    switch (value) {

      case 'ACTIVE':
        return 'status-active';

      case 'INACTIVE':
      case 'DEACTIVATED':
        return 'status-inactive';

      case 'PENDING':
        return 'status-pending';

      default:
        return 'status-default';
    }
  }

  // ==========================================================
  // AVATAR INITIALS
  // ==========================================================

  getInitials(fullName: string): string {

    if (!fullName) {
      return 'U';
    }

    const words =
      fullName.trim().split(/\s+/);

    if (words.length === 1) {

      return words[0]
        .substring(0, 2)
        .toUpperCase();
    }

    return (
      words[0].charAt(0) +
      words[words.length - 1].charAt(0)
    ).toUpperCase();
  }

  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  formatDate(date: string | null): string {

    if (!date) {
      return 'Never';
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
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
  // TRACK BY
  // ==========================================================

  trackByUserId(
    index: number,
    user: UserManagementResponse
  ): number {

    return user.id;
  }
}