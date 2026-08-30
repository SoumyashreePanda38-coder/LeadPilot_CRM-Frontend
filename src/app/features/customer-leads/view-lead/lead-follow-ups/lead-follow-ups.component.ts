import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges
} from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { LeadFollowUpService } from '../../../../core/services/lead-followup.service';
import { FollowUpResponse } from '../../../../core/models/follow-up-response';
import { FollowUpStatus } from '../../../../core/models/follow-up-status.enum';
import { FollowUpType } from '../../../../core/models/follow-up-type.enum';


@Component({
  selector: 'app-lead-follow-ups',
  templateUrl: './lead-follow-ups.component.html',
  styleUrls: ['./lead-follow-ups.component.css']
})
export class LeadFollowUpsComponent implements OnInit, OnChanges {

  // ==========================================================
  // INPUT
  // ==========================================================

  @Input() leadId: number | null = null;


  // ==========================================================
  // DATA
  // ==========================================================

  followUps: FollowUpResponse[] = [];


  // ==========================================================
  // FILTER STATE
  // ==========================================================

  selectedStatus: FollowUpStatus | 'ALL' = 'ALL';

  selectedType: FollowUpType | 'ALL' = 'ALL';


  // ==========================================================
  // UI STATE
  // ==========================================================

  isLoading = false;

  errorMessage = '';

  successMessage = '';


  // ==========================================================
  // ENUM REFERENCES
  // ==========================================================

  FollowUpStatus = FollowUpStatus;

  FollowUpType = FollowUpType;


  // ==========================================================
  // STATUS OPTIONS
  // ==========================================================

  statusOptions: Array<FollowUpStatus | 'ALL'> = [
    'ALL',
    FollowUpStatus.SCHEDULED,
    FollowUpStatus.COMPLETED,
    FollowUpStatus.MISSED,
    FollowUpStatus.RESCHEDULED,
    FollowUpStatus.CANCELLED
  ];


  // ==========================================================
  // TYPE OPTIONS
  // ==========================================================

  typeOptions: Array<FollowUpType | 'ALL'> = [
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
  // CONSTRUCTOR
  // ==========================================================

  constructor(
    private route: ActivatedRoute,
    private leadFollowUpService: LeadFollowUpService
  ) {}


  // ==========================================================
  // INIT
  // ==========================================================

  ngOnInit(): void {

    this.resolveLeadId();

    if (this.leadId !== null) {
      this.loadFollowUps();
    }

  }


  // ==========================================================
  // INPUT CHANGES
  // ==========================================================

  ngOnChanges(changes: SimpleChanges): void {

    if (
      changes['leadId'] &&
      !changes['leadId'].firstChange &&
      this.leadId !== null
    ) {

      this.loadFollowUps();

    }

  }


  // ==========================================================
  // RESOLVE LEAD ID
  // ==========================================================

  private resolveLeadId(): void {

    if (this.leadId !== null && this.leadId !== undefined) {
      return;
    }


    const parentParamMap =
      this.route.parent?.snapshot.paramMap;

    const currentParamMap =
      this.route.snapshot.paramMap;


    const idFromParent =
      parentParamMap?.get('id');

    const idFromCurrent =
      currentParamMap.get('id');


    const rawId =
      idFromParent ?? idFromCurrent;


    if (!rawId) {

      this.leadId = null;

      return;
    }


    const parsedId = Number(rawId);


    if (
      Number.isFinite(parsedId) &&
      parsedId > 0
    ) {

      this.leadId = parsedId;

    } else {

      this.leadId = null;

    }

  }


  // ==========================================================
  // LOAD FOLLOW-UPS
  // ==========================================================

  loadFollowUps(): void {

    if (
      this.leadId === null ||
      this.leadId === undefined ||
      this.leadId <= 0
    ) {

      this.errorMessage =
        'Lead ID is missing. Cannot load follow-ups.';

      this.followUps = [];

      return;
    }


    this.isLoading = true;

    this.errorMessage = '';

    this.successMessage = '';


    this.leadFollowUpService
      .getFollowUpsByLead(this.leadId)
      .subscribe({

        next: (response: FollowUpResponse[]) => {

          const data =
            Array.isArray(response)
              ? response
              : [];


          this.followUps = [...data].sort(
            (a, b) => {

              const aTime =
                new Date(a.scheduledAt).getTime();

              const bTime =
                new Date(b.scheduledAt).getTime();


              if (Number.isNaN(aTime)) {
                return 1;
              }

              if (Number.isNaN(bTime)) {
                return -1;
              }


              return bTime - aTime;

            }
          );


          this.isLoading = false;

        },


        error: (error) => {

          console.error(
            'Failed to load follow-ups:',
            error
          );


          this.isLoading = false;

          this.followUps = [];


          this.errorMessage =
            error?.error?.message ||
            error?.message ||
            'Unable to load follow-ups for this lead.';

        }

      });

  }


  // ==========================================================
  // FILTERS
  // ==========================================================

  applyFilters(): void {
    // Filtering is handled by filteredFollowUps getter.
  }


  // ==========================================================
  // FILTERED FOLLOW-UPS
  // ==========================================================

  get filteredFollowUps(): FollowUpResponse[] {

    return this.followUps.filter(
      (followUp: FollowUpResponse) => {

        const matchesStatus =
          this.selectedStatus === 'ALL' ||
          followUp.status === this.selectedStatus;


        const matchesType =
          this.selectedType === 'ALL' ||
          followUp.followUpType === this.selectedType;


        return matchesStatus && matchesType;

      }
    );

  }


  // ==========================================================
  // SUMMARY COUNTS
  // IMPORTANT:
  // Do NOT use .filter(f => ...) inside HTML.
  // Angular templates do not support arrow functions.
  // ==========================================================

  get totalCount(): number {
    return this.followUps.length;
  }


  get scheduledCount(): number {

    return this.followUps.filter(
      followUp =>
        followUp.status === FollowUpStatus.SCHEDULED
    ).length;

  }


  get completedCount(): number {

    return this.followUps.filter(
      followUp =>
        followUp.status === FollowUpStatus.COMPLETED
    ).length;

  }


  get missedCount(): number {

    return this.followUps.filter(
      followUp =>
        followUp.status === FollowUpStatus.MISSED
    ).length;

  }


  // ==========================================================
  // DATE FORMATTER
  // ==========================================================

  formatScheduledAt(
    dateValue: string | null | undefined
  ): string {

    if (!dateValue) {
      return 'Not scheduled';
    }


    const date =
      new Date(dateValue);


    if (Number.isNaN(date.getTime())) {
      return 'Invalid date';
    }


    return new Intl.DateTimeFormat(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    ).format(date);

  }


  // ==========================================================
  // ENUM FORMATTER
  // ==========================================================

  formatEnum(
    value: string | null | undefined
  ): string {

    if (!value) {
      return '-';
    }


    return value
      .toString()
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char =>
        char.toUpperCase()
      );

  }


  // ==========================================================
  // TYPE / STATUS LABEL
  // ==========================================================

  getTypeLabel(
    value:
      | FollowUpType
      | FollowUpStatus
      | 'ALL'
      | string
  ): string {

    if (!value) {
      return '-';
    }


    if (value === 'ALL') {
      return 'All';
    }


    return this.formatEnum(value);

  }


  // ==========================================================
  // FOLLOW-UP ICON
  // ==========================================================

  getFollowUpIcon(
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
        return 'fa-whatsapp';

      case FollowUpType.MEETING:
        return 'fa-handshake';

      case FollowUpType.VISIT:
        return 'fa-location-dot';

      case FollowUpType.TASK:
        return 'fa-list-check';

      default:
        return 'fa-calendar-check';

    }

  }


  // ==========================================================
  // STATUS CSS CLASS
  // ==========================================================

  getStatusClass(
    status: FollowUpStatus
  ): string {

    switch (status) {

      case FollowUpStatus.COMPLETED:
        return 'status-completed';

      case FollowUpStatus.MISSED:
        return 'status-missed';

      case FollowUpStatus.RESCHEDULED:
        return 'status-rescheduled';

      case FollowUpStatus.CANCELLED:
        return 'status-cancelled';

      case FollowUpStatus.SCHEDULED:
      default:
        return 'status-scheduled';

    }

  }


  // ==========================================================
  // TRACK BY
  // ==========================================================

  trackByFollowUpId(
    index: number,
    item: FollowUpResponse
  ): number {

    return item.followUpId;

  }

}