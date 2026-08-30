import {
  Component,
  OnInit
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  LeadFollowUpService
} from '../../../core/services/lead-followup.service';

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
  CustomerLeadService
} from '../../../core/services/customer-lead.service';

import {
  CustomerLeadResponse
} from '../../../core/models/customer-lead-response';

import {
  HttpClient
} from '@angular/common/http';

import {
  environment
} from '../../../../environments/environment';


/**
 * ==========================================================
 * COMPONENT : AddFollowUpComponent
 *
 * Description :
 * Used by ADMIN to create a follow-up for any customer lead.
 *
 * Admin can select:
 *
 * - Customer Lead
 * - Assigned Executive
 * - Follow-Up Type
 * - Subject
 * - Scheduled Date
 * - Scheduled Time
 * - Location
 * - Description
 *
 * Backend automatically creates a new follow-up with:
 *
 * status = SCHEDULED
 *
 * ==========================================================
 */

@Component({
  selector: 'app-add-follow-up',
  templateUrl: './add-follow-up.component.html',
  styleUrls: ['./add-follow-up.component.css']
})
export class AddFollowUpComponent implements OnInit {


  // ==========================================================
  // LEADS
  // ==========================================================

  leads: CustomerLeadResponse[] = [];


  // ==========================================================
  // EXECUTIVES
  // ==========================================================

  executives: any[] = [];


  // ==========================================================
  // FOLLOW-UP TYPES
  // ==========================================================

  followUpTypes: FollowUpType[] =
    Object.values(FollowUpType);


  // ==========================================================
  // FORM DATA
  // ==========================================================

  followUp: FollowUpRequest = {

    leadId: null as any,

    assignedUserId: null as any,

    followUpType:
      this.followUpTypes.length > 0
        ? this.followUpTypes[0]
        : null as any,

    subject: '',

    scheduledAt: '',

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

    private leadFollowUpService:
      LeadFollowUpService,

    private customerLeadService:
      CustomerLeadService,

    private router:
      Router,

    private http:
      HttpClient

  ) {}


  // ==========================================================
  // ON INIT
  // ==========================================================

  ngOnInit(): void {

    this.loadLeads();

    this.loadExecutives();

    this.setDefaultDateTime();

  }


  // ==========================================================
  // LOAD CUSTOMER LEADS
  // ==========================================================

  loadLeads(): void {

    this.isLoadingLeads = true;

    this.customerLeadService
      .getAllLeads()
      .subscribe({

        next: (
          data: CustomerLeadResponse[]
        ) => {

          this.leads = data || [];

          this.isLoadingLeads = false;

        },

        error: (error: any) => {

          console.error(
            'Error loading customer leads:',
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

          /*
           * If backend returns all users instead of only
           * executives, filter them here.
           */

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
  // SET DEFAULT DATE / TIME
  // ==========================================================

  setDefaultDateTime(): void {

    const now = new Date();

    this.selectedDate =
      this.formatDateForInput(now);

    this.selectedTime =
      this.formatTimeForInput(now);

    this.onDateTimeChange();

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

      this.followUp.scheduledAt = '';

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

      this.followUp.assignedUserId =
        null as any;

      return;

    }

    const selectedLead =
      this.leads.find(
        lead =>
          Number(lead.leadId) ===
          Number(this.followUp.leadId)
      );


    /*
     * Automatically select the lead's existing
     * assigned executive when available.
     */

    if (
      selectedLead &&
      selectedLead.assignedUserId
    ) {

      this.followUp.assignedUserId =
        Number(
          selectedLead.assignedUserId
        );

    }

  }


  // ==========================================================
  // FOLLOW-UP TYPE CHANGE
  // ==========================================================

  onFollowUpTypeChange(): void {

    /*
     * Location is mainly useful for:
     *
     * MEETING
     * VISIT
     */

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
  // LOCATION RECOMMENDATION
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
  // SAVE FOLLOW-UP
  // ==========================================================

  saveFollowUp(): void {

    // --------------------------------------------------------
    // CLEAR MESSAGES
    // --------------------------------------------------------

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

    if (
      !this.followUp.leadId
    ) {

      this.errorMessage =
        'Please select a customer lead.';

      return;

    }


    // --------------------------------------------------------
    // VALIDATE EXECUTIVE
    // --------------------------------------------------------

    if (
      !this.followUp.assignedUserId
    ) {

      this.errorMessage =
        'Please select an executive.';

      return;

    }


    // --------------------------------------------------------
    // VALIDATE TYPE
    // --------------------------------------------------------

    if (
      !this.followUp.followUpType
    ) {

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
    // CHECK PAST DATE/TIME
    // --------------------------------------------------------

    if (
      this.isScheduledDateInPast()
    ) {

      this.errorMessage =
        'Follow-up date and time cannot be in the past.';

      return;

    }


    // --------------------------------------------------------
    // VALIDATE LOCATION
    // --------------------------------------------------------

    if (
      this.followUp.location &&
      this.followUp.location.length > 500
    ) {

      this.errorMessage =
        'Location cannot exceed 500 characters.';

      return;

    }


    // --------------------------------------------------------
    // VALIDATE DESCRIPTION
    // --------------------------------------------------------

    if (
      this.followUp.description &&
      this.followUp.description.length > 1000
    ) {

      this.errorMessage =
        'Description cannot exceed 1000 characters.';

      return;

    }


    // ========================================================
    // START SAVING
    // ========================================================

    this.isSaving = true;


    // ========================================================
    // REQUEST
    // ========================================================

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
        this.followUp.location?.trim() || undefined,

      description:
        this.followUp.description?.trim() || undefined

    };


    // ========================================================
    // API CALL
    // ========================================================

    this.leadFollowUpService
      .createFollowUp(request)
      .subscribe({

        // ====================================================
        // SUCCESS
        // ====================================================

        next: (
          response: FollowUpResponse
        ) => {

          console.log(
            'Follow-up created successfully:',
            response
          );

          this.isSaving = false;

          this.successMessage =
            'Follow-up scheduled successfully.';

          /*
           * Navigate to overall Follow-Ups page
           * after a short delay.
           */

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
            'Error creating follow-up:',
            error
          );

          this.isSaving = false;

          this.errorMessage =
            error?.error?.message ||
            'Unable to create follow-up. Please try again.';

        }

      });

  }


  // ==========================================================
  // CHECK PAST DATE/TIME
  // ==========================================================

  isScheduledDateInPast(): boolean {

    if (
      !this.selectedDate ||
      !this.selectedTime
    ) {

      return false;

    }

    const selectedDateTime =
      new Date(
        `${this.selectedDate}T${this.selectedTime}`
      );

    const now =
      new Date();

    return (
      selectedDateTime.getTime() <
      now.getTime()
    );

  }


  // ==========================================================
  // RESET FORM
  // ==========================================================

  resetForm(): void {

    this.followUp = {

      leadId:
        null as any,

      assignedUserId:
        null as any,

      followUpType:
        this.followUpTypes.length > 0
          ? this.followUpTypes[0]
          : null as any,

      subject: '',

      scheduledAt: '',

      location: '',

      description: '',

      status:
        null as any,

      completedAt:
        null,

      outcome:
        ''

    };

    this.setDefaultDateTime();

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
  // FORMAT FOLLOW-UP TYPE
  // ==========================================================

  formatFollowUpType(
    value: FollowUpType
  ): string {

    return this.formatEnum(
      value
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
  // GET EXECUTIVE ID
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
  // GET EXECUTIVE NAME
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
  // GET SELECTED LEAD
  // ==========================================================

  getSelectedLead():
    CustomerLeadResponse | undefined {

    if (
      !this.followUp.leadId
    ) {

      return undefined;

    }

    return this.leads.find(

      lead =>
        Number(lead.leadId) ===
        Number(this.followUp.leadId)

    );

  }


  // ==========================================================
  // GET SELECTED EXECUTIVE
  // ==========================================================

  getSelectedExecutive():
    any | undefined {

    if (
      !this.followUp.assignedUserId
    ) {

      return undefined;

    }

    return this.executives.find(

      executive =>
        this.getExecutiveId(executive) ===
        Number(this.followUp.assignedUserId)

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