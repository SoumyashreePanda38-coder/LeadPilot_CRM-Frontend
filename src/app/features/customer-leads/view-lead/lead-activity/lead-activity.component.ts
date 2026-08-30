import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { LeadActivityService } from
  '../../../../core/services/lead-activity.service';

import { LeadActivityRequest } from
  '../../../../core/models/lead-activity-request';

import { LeadActivityResponse } from
  '../../../../core/models/lead-activity-response';

import { LeadActivityType } from
  '../../../../core/models/lead-activity-type.enum';


@Component({
  selector: 'app-lead-activity',
  templateUrl: './lead-activity.component.html',
  styleUrls: ['./lead-activity.component.css']
})
export class LeadActivityComponent
  implements OnInit, OnChanges {

  // ==========================================================
  // INPUT
  // ==========================================================

  @Input() leadId: number | null = null;


  // ==========================================================
  // ACTIVITY DATA
  // ==========================================================

  activities: LeadActivityResponse[] = [];


  // ==========================================================
  // FORM DATA
  // ==========================================================

  selectedActivityType: LeadActivityType =
    LeadActivityType.CALL;

  description = '';


  // ==========================================================
  // ENUM
  // ==========================================================

  activityTypes = Object.values(
    LeadActivityType
  );


  // ==========================================================
  // UI STATE
  // ==========================================================

  isLoading = false;

  isSaving = false;

  errorMessage = '';

  successMessage = '';

  showAddActivityForm = false;


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(
    private leadActivityService: LeadActivityService
  ) {}


  // ==========================================================
  // ON INIT
  // ==========================================================

  ngOnInit(): void {

    if (this.leadId) {
      this.loadActivities();
    }

  }


  // ==========================================================
  // ON CHANGES
  // ==========================================================

  ngOnChanges(
    changes: SimpleChanges
  ): void {

    if (
      changes['leadId'] &&
      this.leadId
    ) {

      this.loadActivities();

    }

  }


  // ==========================================================
  // LOAD ACTIVITIES
  // ==========================================================

  loadActivities(): void {

    if (!this.leadId) {
      return;
    }

    this.isLoading = true;

    this.errorMessage = '';

    this.leadActivityService
      .getActivitiesByLead(this.leadId)
      .subscribe({

        next: (
          data: LeadActivityResponse[]
        ) => {

          this.activities = data || [];

          this.isLoading = false;

        },

        error: (error) => {

          console.error(
            'Failed to load lead activities:',
            error
          );

          this.activities = [];

          this.isLoading = false;

          this.errorMessage =
            error?.error?.message ||
            'Unable to load lead activities.';

        }

      });

  }


  // ==========================================================
  // OPEN ADD ACTIVITY FORM
  // ==========================================================

  openAddActivity(): void {

    this.errorMessage = '';

    this.successMessage = '';

    this.description = '';

    this.selectedActivityType =
      LeadActivityType.CALL;

    this.showAddActivityForm = true;

  }


  // ==========================================================
  // CLOSE ADD ACTIVITY FORM
  // ==========================================================

  closeAddActivity(): void {

    if (this.isSaving) {
      return;
    }

    this.showAddActivityForm = false;

    this.description = '';

    this.errorMessage = '';

  }


  // ==========================================================
  // ADD ACTIVITY
  // ==========================================================

  addActivity(): void {

    // --------------------------------------------------------
    // CHECK LEAD ID
    // --------------------------------------------------------

    if (!this.leadId) {

      this.errorMessage =
        'Lead ID is missing.';

      return;

    }


    // --------------------------------------------------------
    // VALIDATE ACTIVITY TYPE
    // --------------------------------------------------------

    if (!this.selectedActivityType) {

      this.errorMessage =
        'Please select an activity type.';

      return;

    }


    // --------------------------------------------------------
    // VALIDATE DESCRIPTION
    // --------------------------------------------------------

    if (
      this.description &&
      this.description.length > 1000
    ) {

      this.errorMessage =
        'Description cannot exceed 1000 characters.';

      return;

    }


    // --------------------------------------------------------
    // PREVENT DOUBLE SUBMISSION
    // --------------------------------------------------------

    if (this.isSaving) {
      return;
    }


    // --------------------------------------------------------
    // START SAVING
    // --------------------------------------------------------

    this.isSaving = true;

    this.errorMessage = '';

    this.successMessage = '';


    // --------------------------------------------------------
    // PREPARE REQUEST
    // --------------------------------------------------------

    const request: LeadActivityRequest = {

      leadId: this.leadId,

      activityType:
        this.selectedActivityType,

      description:
        this.description.trim() || undefined

    };


    // --------------------------------------------------------
    // API CALL
    // --------------------------------------------------------

    this.leadActivityService
      .createActivity(request)
      .subscribe({

        // ====================================================
        // SUCCESS
        // ====================================================

        next: (
          activity: LeadActivityResponse
        ) => {

          this.isSaving = false;

          this.successMessage =
            'Activity added successfully.';


          // --------------------------------------------------
          // Add newly created activity at top
          // --------------------------------------------------

          this.activities = [
            activity,
            ...this.activities
          ];


          // --------------------------------------------------
          // Reset form
          // --------------------------------------------------

          this.description = '';

          this.selectedActivityType =
            LeadActivityType.CALL;

          this.showAddActivityForm = false;


          // --------------------------------------------------
          // Clear success message
          // --------------------------------------------------

          setTimeout(() => {

            this.successMessage = '';

          }, 3000);

        },


        // ====================================================
        // ERROR
        // ====================================================

        error: (error) => {

          console.error(
            'Failed to create lead activity:',
            error
          );

          this.isSaving = false;

          this.errorMessage =
            error?.error?.message ||
            'Failed to add lead activity. Please try again.';

        }

      });

  }


  // ==========================================================
  // REFRESH ACTIVITIES
  // ==========================================================

  refreshActivities(): void {

    this.loadActivities();

  }


  // ==========================================================
  // FORMAT ACTIVITY TYPE
  // ==========================================================

  formatActivityType(
    type: LeadActivityType | string
  ): string {

    if (!type) {
      return '';
    }

    return String(type)

      .replace(
        /_/g,
        ' '
      )

      .toLowerCase()

      .replace(
        /\b\w/g,
        char => char.toUpperCase()
      );

  }


  // ==========================================================
  // GET ACTIVITY ICON
  // ==========================================================

  getActivityIcon(
    type: LeadActivityType | string
  ): string {

    switch (type) {

      case LeadActivityType.LEAD_CREATED:
        return 'fa-solid fa-user-plus';

      case LeadActivityType.LEAD_UPDATED:
        return 'fa-solid fa-pen';

      case LeadActivityType.LEAD_ASSIGNED:
      case LeadActivityType.LEAD_REASSIGNED:
        return 'fa-solid fa-user-check';

      case LeadActivityType.LEAD_UNASSIGNED:
        return 'fa-solid fa-user-minus';

      case LeadActivityType.CALL:
        return 'fa-solid fa-phone';

      case LeadActivityType.EMAIL:
        return 'fa-solid fa-envelope';

      case LeadActivityType.SMS:
        return 'fa-solid fa-comment-sms';

      case LeadActivityType.WHATSAPP:
        return 'fa-brands fa-whatsapp';

      case LeadActivityType.MEETING_SCHEDULED:
      case LeadActivityType.MEETING_COMPLETED:
      case LeadActivityType.MEETING_CANCELLED:
        return 'fa-solid fa-handshake';

      case LeadActivityType.VISIT_SCHEDULED:
      case LeadActivityType.VISIT_COMPLETED:
      case LeadActivityType.VISIT_CANCELLED:
        return 'fa-solid fa-location-dot';

      case LeadActivityType.STATUS_CHANGED:
        return 'fa-solid fa-chart-line';

      case LeadActivityType.PRIORITY_CHANGED:
        return 'fa-solid fa-fire';

      case LeadActivityType.CATEGORY_CHANGED:
      case LeadActivityType.SUBCATEGORY_CHANGED:
      case LeadActivityType.SOURCE_CHANGED:
        return 'fa-solid fa-tags';

      case LeadActivityType.FOLLOW_UP_CREATED:
      case LeadActivityType.FOLLOW_UP_UPDATED:
      case LeadActivityType.FOLLOW_UP_COMPLETED:
      case LeadActivityType.FOLLOW_UP_RESCHEDULED:
      case LeadActivityType.FOLLOW_UP_CANCELLED:
      case LeadActivityType.FOLLOW_UP_MISSED:
        return 'fa-solid fa-calendar-check';

      case LeadActivityType.NOTE_ADDED:
      case LeadActivityType.NOTE_UPDATED:
      case LeadActivityType.NOTE_DELETED:
        return 'fa-solid fa-note-sticky';

      case LeadActivityType.LEAD_CONVERTED:
        return 'fa-solid fa-right-left';

      case LeadActivityType.LEAD_CLOSED:
        return 'fa-solid fa-lock';

      case LeadActivityType.LEAD_REOPENED:
        return 'fa-solid fa-lock-open';

      case LeadActivityType.INTERESTED:
        return 'fa-solid fa-thumbs-up';

      case LeadActivityType.NOT_INTERESTED:
        return 'fa-solid fa-thumbs-down';

      case LeadActivityType.DOCUMENT_ADDED:
      case LeadActivityType.DOCUMENT_UPDATED:
      case LeadActivityType.DOCUMENT_REMOVED:
        return 'fa-solid fa-file';

      case LeadActivityType.LEAD_IMPORTED:
        return 'fa-solid fa-file-import';

      case LeadActivityType.LEAD_EXPORTED:
        return 'fa-solid fa-file-export';

      case LeadActivityType.LEAD_ARCHIVED:
        return 'fa-solid fa-box-archive';

      case LeadActivityType.LEAD_RESTORED:
        return 'fa-solid fa-box-open';

      default:
        return 'fa-solid fa-clock-rotate-left';

    }

  }


  // ==========================================================
  // GET ACTIVITY CLASS
  // ==========================================================

  getActivityClass(
    type: LeadActivityType | string
  ): string {

    if (!type) {
      return 'default';
    }

    const value = String(type)
      .toLowerCase();

    if (
      value.includes('call') ||
      value.includes('email') ||
      value.includes('sms') ||
      value.includes('whatsapp')
    ) {

      return 'communication';

    }

    if (
      value.includes('meeting') ||
      value.includes('visit')
    ) {

      return 'meeting';

    }

    if (
      value.includes('follow_up')
    ) {

      return 'follow-up';

    }

    if (
      value.includes('note')
    ) {

      return 'note';

    }

    if (
      value.includes('status') ||
      value.includes('priority')
    ) {

      return 'change';

    }

    if (
      value.includes('converted') ||
      value.includes('interested')
    ) {

      return 'success';

    }

    if (
      value.includes('closed') ||
      value.includes('cancelled') ||
      value.includes('missed') ||
      value.includes('not_interested')
    ) {

      return 'warning';

    }

    return 'default';

  }


  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  formatDate(
    date: string | Date | null | undefined
  ): string {

    if (!date) {
      return '';
    }

    const parsedDate =
      new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return String(date);
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
  // FORMAT TIME
  // ==========================================================

  formatTime(
    date: string | Date | null | undefined
  ): string {

    if (!date) {
      return '';
    }

    const parsedDate =
      new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return '';
    }

    return parsedDate.toLocaleTimeString(
      'en-IN',
      {
        hour: '2-digit',
        minute: '2-digit'
      }
    );

  }


  // ==========================================================
  // TRACK BY
  // ==========================================================

  trackByActivityId(
    index: number,
    activity: LeadActivityResponse
  ): number {

    return activity.activityId;

  }

}