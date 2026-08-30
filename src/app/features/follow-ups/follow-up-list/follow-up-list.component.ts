import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { FollowUpResponse } from 'src/app/core/models/follow-up-response';
import { FollowUpStatus } from 'src/app/core/models/follow-up-status.enum';
import { FollowUpType } from 'src/app/core/models/follow-up-type.enum';

import { LeadFollowUpService } from 'src/app/core/services/lead-followup.service';


@Component({
  selector: 'app-follow-up-list',
  templateUrl: './follow-up-list.component.html',
  styleUrls: ['./follow-up-list.component.css']
})
export class FollowUpListComponent implements OnInit {

  // ==========================================================
  // ENUM REFERENCES
  // ==========================================================

  FollowUpStatus = FollowUpStatus;
  FollowUpType = FollowUpType;


  // ==========================================================
  // FOLLOW-UPS
  // ==========================================================

  followUps: FollowUpResponse[] = [];

  filteredFollowUps: FollowUpResponse[] = [];


  // ==========================================================
  // LOADING / MESSAGES
  // ==========================================================

  isLoading = false;

  errorMessage = '';

  successMessage = '';


  // ==========================================================
  // SEARCH
  // ==========================================================

  searchKeyword = '';


  // ==========================================================
  // FILTERS
  // ==========================================================

  selectedStatus = 'ALL';

  selectedType = 'ALL';


  // ==========================================================
  // FILTER OPTIONS
  // ==========================================================

  statusOptions: string[] = [
    'ALL',
    FollowUpStatus.SCHEDULED,
    FollowUpStatus.COMPLETED,
    FollowUpStatus.MISSED,
    FollowUpStatus.RESCHEDULED,
    FollowUpStatus.CANCELLED
  ];


  typeOptions: string[] = [
    'ALL',
    FollowUpType.CALL,
    FollowUpType.EMAIL,
    FollowUpType.SMS,
    FollowUpType.WHATSAPP,
    FollowUpType.MEETING,
    FollowUpType.VISIT,
    FollowUpType.TASK
  ];


  // ==========================================================
  // SORTING
  // ==========================================================

  sortField = 'scheduledAt';

  sortDirection: 'asc' | 'desc' = 'asc';


  // ==========================================================
  // PAGINATION
  // ==========================================================

  currentPage = 1;

  pageSize = 10;


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(
    private followUpService: LeadFollowUpService,
    private router: Router,
    private route: ActivatedRoute
  ) {}


  // ==========================================================
  // ON INIT
  // ==========================================================

  ngOnInit(): void {

    this.loadFollowUps();

  }


  // ==========================================================
  // LOAD ALL FOLLOW-UPS
  // ==========================================================

  loadFollowUps(): void {

    this.isLoading = true;

    this.errorMessage = '';

    this.followUpService
      .getAllFollowUps()
      .subscribe({

        next: (data: FollowUpResponse[]) => {

          this.followUps = data || [];

          this.applyFilters();

          this.isLoading = false;

        },

        error: (error) => {

          console.error(
            'Error loading follow-ups:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to load follow-ups. Please try again.';

          this.followUps = [];

          this.filteredFollowUps = [];

          this.isLoading = false;

        }

      });

  }


  // ==========================================================
  // APPLY SEARCH + FILTERS
  // ==========================================================

  applyFilters(): void {

    const keyword =
      this.searchKeyword
        .trim()
        .toLowerCase();


    this.filteredFollowUps =
      this.followUps.filter(
        (followUp: FollowUpResponse) => {

          // --------------------------------------------------
          // SEARCH
          // --------------------------------------------------

          const matchesSearch =
            !keyword ||

            this.safeString(
              followUp.leadName
            ).includes(keyword) ||

            this.safeString(
              followUp.subject
            ).includes(keyword) ||

            this.safeString(
              followUp.assignedUserName
            ).includes(keyword) ||

            this.safeString(
              followUp.location
            ).includes(keyword) ||

            this.safeString(
              followUp.description
            ).includes(keyword);


          // --------------------------------------------------
          // STATUS
          // --------------------------------------------------

          const matchesStatus =
            this.selectedStatus === 'ALL' ||
            followUp.status ===
              this.selectedStatus;


          // --------------------------------------------------
          // TYPE
          // --------------------------------------------------

          const matchesType =
            this.selectedType === 'ALL' ||
            followUp.followUpType ===
              this.selectedType;


          return (
            matchesSearch &&
            matchesStatus &&
            matchesType
          );

        }
      );


    // --------------------------------------------------------
    // SORT
    // --------------------------------------------------------

    this.sortFollowUps();


    // --------------------------------------------------------
    // RESET PAGE
    // --------------------------------------------------------

    this.currentPage = 1;

  }


  // ==========================================================
  // SEARCH
  // ==========================================================

  onSearch(): void {

    this.applyFilters();

  }


  // ==========================================================
  // CLEAR SEARCH
  // ==========================================================

  clearSearch(): void {

    this.searchKeyword = '';

    this.applyFilters();

  }


  // ==========================================================
  // STATUS FILTER
  // ==========================================================

  onStatusChange(): void {

    this.applyFilters();

  }


  // ==========================================================
  // TYPE FILTER
  // ==========================================================

  onTypeChange(): void {

    this.applyFilters();

  }


  // ==========================================================
  // CLEAR ALL FILTERS
  // ==========================================================

  clearFilters(): void {

    this.searchKeyword = '';

    this.selectedStatus = 'ALL';

    this.selectedType = 'ALL';

    this.applyFilters();

  }


  // ==========================================================
  // STATUS COUNTS
  // ==========================================================

  getStatusCount(
    status: string
  ): number {

    return this.followUps.filter(
      (followUp: FollowUpResponse) =>
        followUp.status === status
    ).length;

  }


  // ==========================================================
  // TOTAL COUNT
  // ==========================================================

  getTotalCount(): number {

    return this.followUps.length;

  }


  // ==========================================================
  // SCHEDULED COUNT
  // ==========================================================

  getScheduledCount(): number {

    return this.getStatusCount(
      FollowUpStatus.SCHEDULED
    );

  }


  // ==========================================================
  // COMPLETED COUNT
  // ==========================================================

  getCompletedCount(): number {

    return this.getStatusCount(
      FollowUpStatus.COMPLETED
    );

  }


  // ==========================================================
  // MISSED COUNT
  // ==========================================================

  getMissedCount(): number {

    return this.getStatusCount(
      FollowUpStatus.MISSED
    );

  }


  // ==========================================================
  // RESCHEDULED COUNT
  // ==========================================================

  getRescheduledCount(): number {

    return this.getStatusCount(
      FollowUpStatus.RESCHEDULED
    );

  }


  // ==========================================================
  // CANCELLED COUNT
  // ==========================================================

  getCancelledCount(): number {

    return this.getStatusCount(
      FollowUpStatus.CANCELLED
    );

  }


  // ==========================================================
  // STATUS CLASS
  // ==========================================================

  getStatusClass(
    status: FollowUpStatus
  ): string {

    switch (status) {

      case FollowUpStatus.SCHEDULED:
        return 'status-scheduled';

      case FollowUpStatus.COMPLETED:
        return 'status-completed';

      case FollowUpStatus.MISSED:
        return 'status-missed';

      case FollowUpStatus.RESCHEDULED:
        return 'status-rescheduled';

      case FollowUpStatus.CANCELLED:
        return 'status-cancelled';

      default:
        return 'status-default';

    }

  }


  // ==========================================================
  // STATUS ICON
  // ==========================================================

  getStatusIcon(
    status: FollowUpStatus
  ): string {

    switch (status) {

      case FollowUpStatus.SCHEDULED:
        return 'fa-clock';

      case FollowUpStatus.COMPLETED:
        return 'fa-circle-check';

      case FollowUpStatus.MISSED:
        return 'fa-triangle-exclamation';

      case FollowUpStatus.RESCHEDULED:
        return 'fa-calendar-days';

      case FollowUpStatus.CANCELLED:
        return 'fa-circle-xmark';

      default:
        return 'fa-circle';

    }

  }


  // ==========================================================
  // FOLLOW-UP TYPE CLASS
  // ==========================================================

  getTypeClass(
    type: FollowUpType
  ): string {

    switch (type) {

      case FollowUpType.CALL:
        return 'type-call';

      case FollowUpType.EMAIL:
        return 'type-email';

      case FollowUpType.SMS:
        return 'type-sms';

      case FollowUpType.WHATSAPP:
        return 'type-whatsapp';

      case FollowUpType.MEETING:
        return 'type-meeting';

      case FollowUpType.VISIT:
        return 'type-visit';

      case FollowUpType.TASK:
        return 'type-task';

      default:
        return 'type-default';

    }

  }


  // ==========================================================
  // FORMAT FOLLOW-UP TYPE
  // ==========================================================

  formatType(
    type: FollowUpType
  ): string {

    if (!type) {
      return '';
    }

    return type
      .toString()
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(
        /\b\w/g,
        char => char.toUpperCase()
      );

  }


  // ==========================================================
  // FORMAT STATUS
  // ==========================================================

  formatStatus(
    status: FollowUpStatus
  ): string {

    if (!status) {
      return '';
    }

    return status
      .toString()
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(
        /\b\w/g,
        char => char.toUpperCase()
      );

  }


  // ==========================================================
  // GET TYPE ICON
  // ==========================================================

  getTypeIcon(
    type: FollowUpType
  ): string {

    switch (type) {

      case FollowUpType.CALL:
        return 'fa-phone';

      case FollowUpType.EMAIL:
        return 'fa-envelope';

      case FollowUpType.SMS:
        return 'fa-comment-sms';

      case FollowUpType.WHATSAPP:
        return 'fa-brands fa-whatsapp';

      case FollowUpType.MEETING:
        return 'fa-users';

      case FollowUpType.VISIT:
        return 'fa-location-dot';

      case FollowUpType.TASK:
        return 'fa-list-check';

      default:
        return 'fa-calendar-check';

    }

  }


  // ==========================================================
  // TRACK BY
  // ==========================================================

  trackByFollowUpId(
    index: number,
    followUp: FollowUpResponse
  ): number {

    return followUp.followUpId;

  }


  // ==========================================================
  // OPEN DETAILS
  // ==========================================================

  openDetails(
    followUp: FollowUpResponse
  ): void {

    if (!followUp?.followUpId) {
      return;
    }

    this.router.navigate(
      [
        'details',
        followUp.followUpId
      ],
      {
        relativeTo: this.route
      }
    );

  }


  // ==========================================================
  // EDIT FOLLOW-UP
  // ==========================================================

  editFollowUp(
    followUp: FollowUpResponse
  ): void {

    if (!followUp?.followUpId) {
      return;
    }

    this.router.navigate(
      [
        'edit',
        followUp.followUpId
      ],
      {
        relativeTo: this.route
      }
    );

  }


  // ==========================================================
  // ADD FOLLOW-UP
  // ==========================================================

  addFollowUp(): void {

    this.router.navigate(
      ['add'],
      {
        relativeTo: this.route
      }
    );

  }


  // ==========================================================
  // GO BACK
  // ==========================================================

  goBack(): void {

    this.router.navigate(
      ['../dashboard'],
      {
        relativeTo: this.route
      }
    );

  }


  // ==========================================================
  // SORT FOLLOW-UPS
  // ==========================================================

  sortFollowUps(): void {

    this.filteredFollowUps.sort(
      (
        first: FollowUpResponse,
        second: FollowUpResponse
      ) => {

        let firstValue: any;

        let secondValue: any;


        switch (this.sortField) {

          case 'scheduledAt':

            firstValue =
              new Date(
                first.scheduledAt
              ).getTime();

            secondValue =
              new Date(
                second.scheduledAt
              ).getTime();

            break;


          case 'leadName':

            firstValue =
              this.safeString(
                first.leadName
              );

            secondValue =
              this.safeString(
                second.leadName
              );

            break;


          case 'status':

            firstValue =
              this.safeString(
                first.status
              );

            secondValue =
              this.safeString(
                second.status
              );

            break;


          default:

            firstValue =
              new Date(
                first.scheduledAt
              ).getTime();

            secondValue =
              new Date(
                second.scheduledAt
              ).getTime();

            break;

        }


        if (firstValue < secondValue) {

          return this.sortDirection === 'asc'
            ? -1
            : 1;

        }


        if (firstValue > secondValue) {

          return this.sortDirection === 'asc'
            ? 1
            : -1;

        }


        return 0;

      }
    );

  }


  // ==========================================================
  // CHANGE SORT
  // ==========================================================

  changeSort(
    field: string
  ): void {

    if (this.sortField === field) {

      this.sortDirection =
        this.sortDirection === 'asc'
          ? 'desc'
          : 'asc';

    } else {

      this.sortField = field;

      this.sortDirection = 'asc';

    }

    this.sortFollowUps();

  }


  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  formatDate(
    date: string | undefined | null
  ): string {

    if (!date) {
      return '—';
    }

    const parsedDate =
      new Date(date);

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
  // FORMAT DATE & TIME
  // ==========================================================

  formatDateTime(
    date: string | undefined | null
  ): string {

    if (!date) {
      return '—';
    }

    const parsedDate =
      new Date(date);

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
  // FORMAT SCHEDULED AT
  // ==========================================================

  formatScheduledAt(
    date: string | undefined | null
  ): string {

    return this.formatDateTime(date);

  }


  // ==========================================================
  // CHECK OVERDUE
  // ==========================================================

  isOverdue(
    followUp: FollowUpResponse
  ): boolean {

    if (!followUp?.scheduledAt) {
      return false;
    }

    if (
      followUp.status !==
      FollowUpStatus.SCHEDULED
    ) {
      return false;
    }

    return (
      new Date(
        followUp.scheduledAt
      ).getTime() < Date.now()
    );

  }


  // ==========================================================
  // CHECK TODAY
  // ==========================================================

  isToday(
    date: string | undefined | null
  ): boolean {

    if (!date) {
      return false;
    }

    const target =
      new Date(date);

    const today =
      new Date();

    return (
      target.getDate() === today.getDate() &&
      target.getMonth() === today.getMonth() &&
      target.getFullYear() === today.getFullYear()
    );

  }


  // ==========================================================
  // SAFE STRING
  // ==========================================================

  private safeString(
    value: any
  ): string {

    if (
      value === null ||
      value === undefined
    ) {
      return '';
    }

    return String(value).toLowerCase();

  }


  // ==========================================================
  // PAGINATION
  // ==========================================================

  get totalPages(): number {

    if (
      this.filteredFollowUps.length === 0
    ) {
      return 1;
    }

    return Math.ceil(
      this.filteredFollowUps.length /
      this.pageSize
    );

  }


  // ==========================================================
  // PAGINATED FOLLOW-UPS
  // ==========================================================

  get paginatedFollowUps(): FollowUpResponse[] {

    const startIndex =
      (this.currentPage - 1) *
      this.pageSize;

    const endIndex =
      startIndex +
      this.pageSize;

    return this.filteredFollowUps.slice(
      startIndex,
      endIndex
    );

  }


  // ==========================================================
  // NEXT PAGE
  // ==========================================================

  nextPage(): void {

    if (
      this.currentPage <
      this.totalPages
    ) {

      this.currentPage++;

    }

  }


  // ==========================================================
  // PREVIOUS PAGE
  // ==========================================================

  previousPage(): void {

    if (
      this.currentPage > 1
    ) {

      this.currentPage--;

    }

  }


  // ==========================================================
  // GO TO PAGE
  // ==========================================================

  goToPage(
    page: number
  ): void {

    if (
      page >= 1 &&
      page <= this.totalPages
    ) {

      this.currentPage = page;

    }

  }


  // ==========================================================
  // PAGE NUMBERS
  // ==========================================================

  getPageNumbers(): number[] {

    const pages: number[] = [];

    for (
      let page = 1;
      page <= this.totalPages;
      page++
    ) {

      pages.push(page);

    }

    return pages;

  }


  // ==========================================================
  // PAGE SIZE CHANGE
  // ==========================================================

  changePageSize(
    size: number
  ): void {

    this.pageSize = Number(size);

    this.currentPage = 1;

  }


  // ==========================================================
  // RESULT RANGE
  // ==========================================================

  getStartResult(): number {

    if (
      this.filteredFollowUps.length === 0
    ) {
      return 0;
    }

    return (
      (this.currentPage - 1) *
      this.pageSize
    ) + 1;

  }


  getEndResult(): number {

    return Math.min(
      this.currentPage *
      this.pageSize,
      this.filteredFollowUps.length
    );

  }

}