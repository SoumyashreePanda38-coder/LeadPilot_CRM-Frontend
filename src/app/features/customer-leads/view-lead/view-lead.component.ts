
import {
  Component,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  CustomerLeadService
} from '../../../core/services/customer-lead.service';

import {
  CustomerLeadResponse
} from '../../../core/models/customer-lead-response';

import {
  LeadStatus
} from '../../../core/models/lead-status.enum';

import {
  LeadPriority
} from '../../../core/models/lead-priority.enum';


// ==========================================================
// VIEW LEAD SECTION
// ==========================================================

export type ViewLeadSection =
  | 'overview'
  | 'activity'
  | 'followups'
  | 'notes';


@Component({
  selector: 'app-view-lead',
  templateUrl: './view-lead.component.html',
  styleUrls: ['./view-lead.component.css']
})
export class ViewLeadComponent implements OnInit {


  // ==========================================================
  // LEAD ID
  // ==========================================================

  leadId: number | null = null;


  // ==========================================================
  // LEAD DATA
  // ==========================================================

  lead: CustomerLeadResponse | null = null;


  // ==========================================================
  // ACTIVE SECTION
  // ==========================================================

  /*
   * Controls which child component is displayed.
   *
   * Default:
   * Overview
   */

  activeSection: ViewLeadSection = 'overview';


  // ==========================================================
  // LOADING STATE
  // ==========================================================

  isLoading = false;


  // ==========================================================
  // MESSAGE STATE
  // ==========================================================

  errorMessage = '';

  successMessage = '';


  // ==========================================================
  // ENUM REFERENCES
  // ==========================================================

  LeadStatus = LeadStatus;

  LeadPriority = LeadPriority;


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customerLeadService: CustomerLeadService
  ) {}


  // ==========================================================
  // ON INIT
  // ==========================================================

  ngOnInit(): void {

    this.route.paramMap.subscribe(params => {

      const idParam = params.get('id');

      const parsedLeadId = idParam
        ? Number(idParam)
        : NaN;


      // ------------------------------------------------------
      // VALIDATE LEAD ID
      // ------------------------------------------------------

      if (
        Number.isNaN(parsedLeadId) ||
        parsedLeadId <= 0
      ) {

        this.leadId = null;

        this.lead = null;

        this.errorMessage =
          'Invalid lead ID. Unable to load lead details.';

        return;
      }


      // ------------------------------------------------------
      // STORE LEAD ID
      // ------------------------------------------------------

      this.leadId = parsedLeadId;


      // ------------------------------------------------------
      // RESET PAGE STATE
      // ------------------------------------------------------

      this.lead = null;

      this.errorMessage = '';

      this.successMessage = '';

      /*
       * Every time a new lead is opened,
       * start from Overview.
       */

      this.activeSection = 'overview';


      // ------------------------------------------------------
      // LOAD LEAD
      // ------------------------------------------------------

      this.loadLead();

    });

  }


  // ==========================================================
  // LOAD LEAD
  // ==========================================================

  loadLead(): void {

    if (!this.leadId) {

      this.errorMessage =
        'Lead ID is missing.';

      return;
    }


    this.isLoading = true;

    this.errorMessage = '';


    this.customerLeadService
      .getLeadById(this.leadId)
      .subscribe({

        // ====================================================
        // SUCCESS
        // ====================================================

        next: (
          response: CustomerLeadResponse
        ) => {

          this.lead = response;

          this.isLoading = false;

        },


        // ====================================================
        // ERROR
        // ====================================================

        error: (error) => {

          console.error(
            'Failed to load customer lead:',
            error
          );

          this.isLoading = false;

          this.lead = null;

          this.errorMessage =
            error?.error?.message ||
            'Unable to load customer lead details. Please try again.';

        }

      });

  }


  // ==========================================================
  // SELECT TAB
  // ==========================================================

  /**
   * Changes the visible child component inside
   * the View Lead page.
   *
   * IMPORTANT:
   * This does NOT navigate to another page.
   */

  setActiveTab(
    section: ViewLeadSection
  ): void {

    this.activeSection = section;

  }


  // ==========================================================
  // SELECT SECTION
  // ==========================================================

  /**
   * Alternative method for selecting a section.
   *
   * Can also be used by future components/buttons.
   */

  selectSection(
    section: ViewLeadSection
  ): void {

    this.activeSection = section;

  }


  // ==========================================================
  // OVERVIEW
  // ==========================================================

  showOverview(): boolean {

    return this.activeSection === 'overview';

  }


  // ==========================================================
  // ACTIVITY
  // ==========================================================

  showActivity(): boolean {

    return this.activeSection === 'activity';

  }


  // ==========================================================
  // FOLLOW-UPS
  // ==========================================================

  showFollowUps(): boolean {

    return this.activeSection === 'followups';

  }


  // ==========================================================
  // NOTES
  // ==========================================================

  showNotes(): boolean {

    return this.activeSection === 'notes';

  }


  // ==========================================================
  // EDIT LEAD
  // ==========================================================

  editLead(): void {

    if (!this.leadId) {

      return;
    }


    this.router.navigate([
      '/admin/leads/edit',
      this.leadId
    ]);

  }


  // ==========================================================
  // BACK TO LEAD LIST
  // ==========================================================

  goBack(): void {

    this.router.navigate([
      '/admin/leads'
    ]);

  }


  // ==========================================================
  // RETRY LOADING
  // ==========================================================

  retryLoad(): void {

    this.errorMessage = '';

    this.loadLead();

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


  // ==========================================================
  // LEAD STATUS
  // ==========================================================

  getLeadStatus(): string {

    if (!this.lead?.leadStatus) {

      return '-';

    }

    return this.formatEnum(
      this.lead.leadStatus.toString()
    );

  }


  // ==========================================================
  // LEAD PRIORITY
  // ==========================================================

  getLeadPriority(): string {

    if (!this.lead?.leadPriority) {

      return '-';

    }

    return this.formatEnum(
      this.lead.leadPriority.toString()
    );

  }


  // ==========================================================
  // STATUS CSS CLASS
  // ==========================================================

  getStatusClass(): string {

    if (!this.lead?.leadStatus) {

      return '';

    }

    return this.lead.leadStatus
      .toString()
      .toLowerCase()
      .replace(/_/g, '-')
      .replace(/\s+/g, '-');

  }


  // ==========================================================
  // PRIORITY CSS CLASS
  // ==========================================================

  getPriorityClass(): string {

    if (!this.lead?.leadPriority) {

      return '';

    }

    return this.lead.leadPriority
      .toString()
      .toLowerCase()
      .replace(/_/g, '-')
      .replace(/\s+/g, '-');

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
      .replace(/_/g, ' ')
      .toLowerCase()
      .replace(
        /\b\w/g,
        char => char.toUpperCase()
      );

  }


  // ==========================================================
  // CUSTOMER INITIALS
  // ==========================================================

  getCustomerInitials(): string {

    const name =
      this.lead?.fullName?.trim();


    if (!name) {

      return 'CL';

    }


    const parts =
      name.split(/\s+/);


    if (parts.length === 1) {

      return parts[0]
        .substring(0, 2)
        .toUpperCase();

    }


    return (
      parts[0].charAt(0) +
      parts[parts.length - 1].charAt(0)
    ).toUpperCase();

  }


  // ==========================================================
  // CUSTOMER NAME
  // ==========================================================

  getCustomerName(): string {

    return this.lead?.fullName?.trim() ||
      'Customer Lead';

  }


  // ==========================================================
  // PHONE
  // ==========================================================

  getPhoneNumber(): string {

    return this.lead?.phoneNumber?.trim() ||
      'Not provided';

  }


  // ==========================================================
  // EMAIL
  // ==========================================================

  getEmail(): string {

    return this.lead?.email?.trim() ||
      'Not provided';

  }


  // ==========================================================
  // CITY
  // ==========================================================

  getCity(): string {

    return this.lead?.city?.trim() ||
      'Not provided';

  }


  // ==========================================================
  // CATEGORY
  // ==========================================================

  getCategoryName(): string {

    return this.lead?.categoryName?.trim() ||
      'Not assigned';

  }


  // ==========================================================
  // SUBCATEGORY
  // ==========================================================

  getSubCategoryName(): string {

    return this.lead?.subCategoryName?.trim() ||
      'Not assigned';

  }


  // ==========================================================
  // SOURCE
  // ==========================================================

  getSourceName(): string {

    return this.lead?.sourceName?.trim() ||
      'Not assigned';

  }


  // ==========================================================
  // ASSIGNED EXECUTIVE
  // ==========================================================

  getAssignedExecutive(): string {

    return this.lead?.assignedUserName?.trim() ||
      'Unassigned';

  }

}
