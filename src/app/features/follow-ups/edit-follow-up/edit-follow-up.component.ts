import {
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  HttpClient
} from '@angular/common/http';

import {
  LeadFollowUpService
} from '../../../core/services/lead-followup.service';

import {
  CustomerLeadService
} from '../../../core/services/customer-lead.service';

import {
  FollowUpRequest
} from '../../../core/models/follow-up-request';

import {
  FollowUpResponse
} from '../../../core/models/follow-up-response';

import {
  FollowUpType
} from '../../../core/models/follow-up-type.enum';

import {
  FollowUpStatus
} from '../../../core/models/follow-up-status.enum';

import {
  CustomerLeadResponse
} from '../../../core/models/customer-lead-response';

import {
  environment
} from '../../../../environments/environment';


@Component({
  selector: 'app-edit-follow-up',
  templateUrl: './edit-follow-up.component.html',
  styleUrls: [
    './edit-follow-up.component.css'
  ]
})
export class EditFollowUpComponent implements OnInit {

  // ==========================================================
  // FOLLOW-UP ID
  // ==========================================================

  followUpId!: number;


  // ==========================================================
  // LEADS
  // ==========================================================

  leads: CustomerLeadResponse[] = [];


  // ==========================================================
  // EXECUTIVES
  // ==========================================================

  executives: any[] = [];


  // ==========================================================
  // ENUMS
  // ==========================================================

  followUpTypes: FollowUpType[] =
    Object.values(FollowUpType);

  followUpStatuses: FollowUpStatus[] =
    Object.values(FollowUpStatus);


  // ==========================================================
  // FORM
  // ==========================================================

  followUp: FollowUpRequest = {

    leadId: null as any,

    assignedUserId: null as any,

    followUpType:
      this.followUpTypes.length > 0
        ? this.followUpTypes[0]
        : null as any,

    subject: '',

    scheduledAt: null as any,

    location: '',

    description: '',

    status: null as any,

    completedAt: null,

    outcome: ''
  };


  // ==========================================================
  // DATE / TIME
  // ==========================================================

  selectedDate = '';

  selectedTime = '';


  // ==========================================================
  // UI STATE
  // ==========================================================

  isLoading = false;

  isSaving = false;

  isLoadingLeads = false;

  isLoadingExecutives = false;


  // ==========================================================
  // MESSAGES
  // ==========================================================

  successMessage = '';

  errorMessage = '';


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(

    private route: ActivatedRoute,

    private router: Router,

    private leadFollowUpService:
      LeadFollowUpService,

    private customerLeadService:
      CustomerLeadService,

    private http: HttpClient

  ) {}


  // ==========================================================
  // ON INIT
  // ==========================================================

  ngOnInit(): void {

    this.followUpId =
      Number(
        this.route.snapshot.paramMap.get('id')
      );

    if (!this.followUpId) {

      this.errorMessage =
        'Invalid follow-up ID.';

      return;

    }

    this.loadLeads();

    this.loadExecutives();

    this.loadFollowUp();

  }


  // ==========================================================
  // LOAD FOLLOW-UP
  // ==========================================================

  loadFollowUp(): void {

    this.isLoading = true;

    this.errorMessage = '';

    this.leadFollowUpService
      .getFollowUpById(this.followUpId)
      .subscribe({

        next: (
          response: FollowUpResponse
        ) => {

          console.log(
            'Follow-up loaded:',
            response
          );

          this.followUp = {

            leadId:
              Number(
                (response as any).leadId
              ),

            assignedUserId:
              Number(
                (response as any).assignedUserId
              ),

            followUpType:
              (response as any).followUpType,

            subject:
              (response as any).subject || '',

            scheduledAt:
              (response as any).scheduledAt,

            location:
              (response as any).location || '',

            description:
              (response as any).description || '',

            status:
              (response as any).status,

            completedAt:
              (response as any).completedAt || null,

            outcome:
              (response as any).outcome || ''
          };


          // --------------------------------------------------
          // Split scheduledAt into date and time
          // --------------------------------------------------

          this.setDateAndTime(
            (response as any).scheduledAt
          );


          this.isLoading = false;

        },

        error: (error: any) => {

          console.error(
            'Error loading follow-up:',
            error
          );

          this.isLoading = false;

          this.errorMessage =
            error?.error?.message ||
            'Unable to load follow-up. Please try again.';

        }

      });

  }


  // ==========================================================
  // LOAD LEADS
  // ==========================================================

  loadLeads(): void {

    this.isLoadingLeads = true;

    this.customerLeadService
      .getAllLeads()
      .subscribe({

        next: (
          data: CustomerLeadResponse[]
        ) => {

          this.leads =
            data || [];

          this.isLoadingLeads = false;

        },

        error: (error: any) => {

          console.error(
            'Error loading leads:',
            error
          );

          this.leads = [];

          this.isLoadingLeads = false;

          this.errorMessage =
            error?.error?.message ||
            'Unable to load customer leads.';

        }

      });

  }


  // ==========================================================
  // LOAD EXECUTIVES
  // ==========================================================

  loadExecutives(): void {

    this.isLoadingExecutives = true;

    this.http
      .get<any[]>(
        `${environment.apiUrl}/admin/users`
      )
      .subscribe({

        next: (
          data: any[]
        ) => {

          this.executives =
            (data || []).filter(

              user =>
                !user.role ||
                String(user.role).toUpperCase() ===
                  'EXECUTIVE'

            );

          this.isLoadingExecutives = false;

        },

        error: (error: any) => {

          console.error(
            'Error loading executives:',
            error
          );

          this.executives = [];

          this.isLoadingExecutives = false;

          this.errorMessage =
            error?.error?.message ||
            'Unable to load executives.';

        }

      });

  }


  // ==========================================================
  // SET DATE / TIME
  // ==========================================================

  setDateAndTime(
    scheduledAt: string
  ): void {

    if (!scheduledAt) {

      return;

    }

    const dateTime =
      new Date(scheduledAt);

    if (isNaN(dateTime.getTime())) {

      return;

    }

    this.selectedDate =
      this.formatDateForInput(
        dateTime
      );

    this.selectedTime =
      this.formatTimeForInput(
        dateTime
      );

  }


  // ==========================================================
  // FORMAT DATE
  // ==========================================================

  private formatDateForInput(
    date: Date
  ): string {

    const year =
      date.getFullYear();

    const month =
      String(
        date.getMonth() + 1
      ).padStart(2, '0');

    const day =
      String(
        date.getDate()
      ).padStart(2, '0');

    return `${year}-${month}-${day}`;

  }


  // ==========================================================
  // FORMAT TIME
  // ==========================================================

  private formatTimeForInput(
    date: Date
  ): string {

    const hours =
      String(
        date.getHours()
      ).padStart(2, '0');

    const minutes =
      String(
        date.getMinutes()
      ).padStart(2, '0');

    return `${hours}:${minutes}`;

  }


  // ==========================================================
  // DATE / TIME CHANGE
  // ==========================================================

  onDateTimeChange(): void {

    if (
      !this.selectedDate ||
      !this.selectedTime
    ) {

      this.followUp.scheduledAt =
        null as any;

      return;

    }

    this.followUp.scheduledAt =
      `${this.selectedDate}T${this.selectedTime}`;

  }


  // ==========================================================
  // LEAD CHANGE
  // ==========================================================

  onLeadChange(): void {

    if (!this.followUp.leadId) {

      return;

    }

    const selectedLead =
      this.leads.find(

        lead =>
          Number(lead.leadId) ===
          Number(this.followUp.leadId)

      );


    if (
      selectedLead &&
      (selectedLead as any).assignedUserId
    ) {

      this.followUp.assignedUserId =
        Number(
          (selectedLead as any).assignedUserId
        );

    }

  }


  // ==========================================================
  // FOLLOW-UP TYPE CHANGE
  // ==========================================================

  onFollowUpTypeChange(): void {

    if (

      this.followUp.followUpType ===
        FollowUpType.CALL ||

      this.followUp.followUpType ===
        FollowUpType.EMAIL ||

      this.followUp.followUpType ===
        FollowUpType.SMS ||

      this.followUp.followUpType ===
        FollowUpType.WHATSAPP ||

      this.followUp.followUpType ===
        FollowUpType.TASK

    ) {

      this.followUp.location = '';

    }

  }


  // ==========================================================
  // LOCATION RECOMMENDED
  // ==========================================================

  isLocationRecommended(): boolean {

    return (

      this.followUp.followUpType ===
        FollowUpType.MEETING ||

      this.followUp.followUpType ===
        FollowUpType.VISIT

    );

  }


  // ==========================================================
  // SAVE CHANGES
  // ==========================================================

  saveFollowUp(): void {

    this.successMessage = '';

    this.errorMessage = '';


    // --------------------------------------------------------
    // PREVENT DOUBLE SUBMISSION
    // --------------------------------------------------------

    if (this.isSaving) {

      return;

    }


    // --------------------------------------------------------
    // VALIDATE LEAD
    // --------------------------------------------------------

    if (!this.followUp.leadId) {

      this.errorMessage =
        'Please select a customer lead.';

      return;

    }


    // --------------------------------------------------------
    // VALIDATE EXECUTIVE
    // --------------------------------------------------------

    if (!this.followUp.assignedUserId) {

      this.errorMessage =
        'Please select an executive.';

      return;

    }


    // --------------------------------------------------------
    // VALIDATE TYPE
    // --------------------------------------------------------

    if (!this.followUp.followUpType) {

      this.errorMessage =
        'Please select a follow-up type.';

      return;

    }


    // --------------------------------------------------------
    // VALIDATE SUBJECT
    // --------------------------------------------------------

    if (
      !this.followUp.subject ||
      !this.followUp.subject.trim()
    ) {

      this.errorMessage =
        'Please enter a follow-up subject.';

      return;

    }


    if (
      this.followUp.subject.trim().length >
      150
    ) {

      this.errorMessage =
        'Subject cannot exceed 150 characters.';

      return;

    }


    // --------------------------------------------------------
    // VALIDATE DATE
    // --------------------------------------------------------

    if (!this.selectedDate) {

      this.errorMessage =
        'Please select a follow-up date.';

      return;

    }


    // --------------------------------------------------------
    // VALIDATE TIME
    // --------------------------------------------------------

    if (!this.selectedTime) {

      this.errorMessage =
        'Please select a follow-up time.';

      return;

    }


    // --------------------------------------------------------
    // CREATE DATETIME
    // --------------------------------------------------------

    this.onDateTimeChange();


    // --------------------------------------------------------
    // DESCRIPTION
    // --------------------------------------------------------

    if (
      this.followUp.description &&
      this.followUp.description.length >
      1000
    ) {

      this.errorMessage =
        'Description cannot exceed 1000 characters.';

      return;

    }


    // --------------------------------------------------------
    // LOCATION
    // --------------------------------------------------------

    if (
      this.followUp.location &&
      this.followUp.location.length >
      500
    ) {

      this.errorMessage =
        'Location cannot exceed 500 characters.';

      return;

    }


    // --------------------------------------------------------
    // START SAVING
    // --------------------------------------------------------

    this.isSaving = true;


    // --------------------------------------------------------
    // REQUEST
    // --------------------------------------------------------

    const request: FollowUpRequest = {

      leadId:
        Number(
          this.followUp.leadId
        ),

      assignedUserId:
        Number(
          this.followUp.assignedUserId
        ),

      followUpType:
        this.followUp.followUpType,

      subject:
        this.followUp.subject.trim(),

      scheduledAt:
        this.followUp.scheduledAt,

      location:
        this.followUp.location?.trim()
        || null as any,

      description:
        this.followUp.description?.trim()
        || null as any,

      status:
        this.followUp.status,

      completedAt:
        this.followUp.completedAt,

      outcome:
        this.followUp.outcome?.trim() || ''

    };


    // ========================================================
    // API CALL
    // ========================================================

    this.leadFollowUpService
      .updateFollowUp(
        this.followUpId,
        request
      )
      .subscribe({

        // ====================================================
        // SUCCESS
        // ====================================================

        next: (
          response: FollowUpResponse
        ) => {

          console.log(
            'Follow-up updated successfully:',
            response
          );

          this.isSaving = false;

          this.successMessage =
            'Follow-up updated successfully.';


          // --------------------------------------------------
          // Navigate back to follow-up list
          // --------------------------------------------------

          setTimeout(() => {

            this.router.navigate([
              '/admin/followups'
            ]);

          }, 900);

        },


        // ====================================================
        // ERROR
        // ====================================================

        error: (error: any) => {

          console.error(
            'Error updating follow-up:',
            error
          );

          this.isSaving = false;

          this.errorMessage =
            error?.error?.message ||
            'Unable to update follow-up. Please try again.';

        }

      });

  }


  // ==========================================================
  // CANCEL
  // ==========================================================

  cancel(): void {

    if (this.isSaving) {

      return;

    }

    this.router.navigate([
      '/admin/followups'
    ]);

  }


  // ==========================================================
  // GO BACK
  // ==========================================================

  goBack(): void {

    this.cancel();

  }


  // ==========================================================
  // FORMAT ENUM
  // ==========================================================

  formatEnum(
    value: string
  ): string {

    if (!value) {

      return '';

    }

    return value

      .replace(
        /_/g,
        ' '
      )

      .toLowerCase()

      .replace(
        /\b\w/g,
        char =>
          char.toUpperCase()
      );

  }


  // ==========================================================
  // GET LEAD NAME
  // ==========================================================

  getLeadName(
    lead: CustomerLeadResponse
  ): string {

    return (

      (lead as any).leadName ||

      (lead as any).fullName ||

      (lead as any).customerName ||

      `Lead #${lead.leadId}`

    );

  }


  // ==========================================================
  // EXECUTIVE ID
  // ==========================================================

  getExecutiveId(
    executive: any
  ): number {

    return Number(

      executive?.id ??
      executive?.userId

    );

  }


  // ==========================================================
  // EXECUTIVE NAME
  // ==========================================================

  getExecutiveName(
    executive: any
  ): string {

    return (

      executive?.fullName ||

      executive?.name ||

      executive?.username ||

      `Executive #${this.getExecutiveId(executive)}`

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