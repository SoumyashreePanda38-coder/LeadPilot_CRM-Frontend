import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { CustomerLeadService } from '../../../core/services/customer-lead.service';
import { LeadSourceService } from '../../../core/services/lead-source.service';
import { UserManagementService } from '../../../core/services/user-management.service';

import { CustomerLeadResponse } from '../../../core/models/customer-lead-response';
import { LeadSourceResponse } from '../../../core/models/lead-source-response';
import { UserManagementResponse } from '../../../core/models/user-management-response';

import { LeadStatus } from '../../../core/models/lead-status.enum';
import { LeadPriority } from '../../../core/models/lead-priority.enum';
import { Role } from '../../../core/models/role';
import { UserStatus } from '../../../core/models/user-status';

@Component({
  selector: 'app-lead-list',
  templateUrl: './lead-list.component.html',
  styleUrls: ['./lead-list.component.css']
})
export class LeadListComponent implements OnInit {

  // ==========================================================
  // LEAD DATA
  // ==========================================================

  leads: CustomerLeadResponse[] = [];

  filteredLeads: CustomerLeadResponse[] = [];


  // ==========================================================
  // MASTER DATA
  // ==========================================================

  /**
   * All lead sources from Lead Source API.
   * This is NOT derived from existing leads.
   */
  sources: LeadSourceResponse[] = [];

  /**
   * All active executives from User Management API.
   * This is NOT derived from existing leads.
   */
  executives: UserManagementResponse[] = [];


  // ==========================================================
  // LOADING / MESSAGES
  // ==========================================================

  isLoading = false;

  isLoadingSources = false;

  isLoadingExecutives = false;

  successMessage = '';

  errorMessage = '';


  // ==========================================================
  // SEARCH
  // ==========================================================

  searchKeyword = '';


  // ==========================================================
  // FILTERS
  // ==========================================================

  selectedStatus = 'ALL';

  selectedPriority = 'ALL';

  selectedCategory = 'ALL';

  selectedSource = 'ALL';

  selectedExecutive = 'ALL';


  // ==========================================================
  // ENUM REFERENCES
  // ==========================================================

  LeadStatus = LeadStatus;

  LeadPriority = LeadPriority;


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(
    private customerLeadService: CustomerLeadService,
    private leadSourceService: LeadSourceService,
    private userManagementService: UserManagementService,
    private router: Router
  ) {}


  // ==========================================================
  // ON INIT
  // ==========================================================

  ngOnInit(): void {

    this.loadLeads();

    this.loadSources();

    this.loadExecutives();

  }


  // ==========================================================
  // LOAD ALL LEADS
  // ==========================================================

  loadLeads(): void {

    this.isLoading = true;

    this.errorMessage = '';

    this.customerLeadService
      .getAllLeads()
      .subscribe({

        next: (data: CustomerLeadResponse[]) => {

          this.leads = data || [];

          this.applyFilters();

          this.isLoading = false;

        },

        error: (error) => {

          console.error(
            'Error loading customer leads:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to load customer leads. Please try again.';

          this.isLoading = false;

        }

      });

  }


  // ==========================================================
  // LOAD ALL LEAD SOURCES
  // ==========================================================

  loadSources(): void {

    this.isLoadingSources = true;

    this.leadSourceService
      .getAllLeadSources()
      .subscribe({

        next: (data: LeadSourceResponse[]) => {

          this.sources = data || [];

          this.isLoadingSources = false;

          console.log(
            'All lead sources loaded:',
            this.sources
          );

        },

        error: (error) => {

          console.error(
            'Error loading lead sources:',
            error
          );

          this.sources = [];

          this.isLoadingSources = false;

          this.errorMessage =
            error?.error?.message ||
            'Unable to load lead sources.';

        }

      });

  }


  // ==========================================================
  // LOAD ALL ACTIVE EXECUTIVES
  // ==========================================================

  loadExecutives(): void {

    this.isLoadingExecutives = true;

    this.userManagementService
      .getAllExecutives()
      .subscribe({

        next: (data: UserManagementResponse[]) => {

          /**
           * Only ACTIVE users having EXECUTIVE role
           * should appear in the executive filter.
           */
          this.executives = (data || []).filter(
            user =>
              user.role === Role.EXECUTIVE &&
              user.status === UserStatus.ACTIVE
          );

          this.isLoadingExecutives = false;

          console.log(
            'All active executives loaded:',
            this.executives
          );

        },

        error: (error) => {

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
  // APPLY SEARCH + FILTERS
  // ==========================================================

  applyFilters(): void {

    const keyword =
      this.searchKeyword
        .trim()
        .toLowerCase();


    this.filteredLeads = this.leads.filter(
      (lead: CustomerLeadResponse) => {


        // ======================================================
        // SEARCH
        // ======================================================

        const matchesSearch =
          !keyword ||

          this.safeString(
            lead.fullName
          ).includes(keyword) ||

          this.safeString(
            lead.phoneNumber
          ).includes(keyword) ||

          this.safeString(
            lead.email
          ).includes(keyword) ||

          this.safeString(
            lead.city
          ).includes(keyword) ||

          this.safeString(
            lead.categoryName
          ).includes(keyword) ||

          this.safeString(
            lead.subCategoryName
          ).includes(keyword) ||

          this.safeString(
            lead.sourceName
          ).includes(keyword) ||

          this.safeString(
            lead.assignedUserName
          ).includes(keyword);


        // ======================================================
        // STATUS
        // ======================================================

        const matchesStatus =
          this.selectedStatus === 'ALL' ||

          this.safeString(
            lead.leadStatus
          ) ===
          this.selectedStatus
            .toLowerCase();


        // ======================================================
        // PRIORITY
        // ======================================================

        const matchesPriority =
          this.selectedPriority === 'ALL' ||

          this.safeString(
            lead.leadPriority
          ) ===
          this.selectedPriority
            .toLowerCase();


        // ======================================================
        // CATEGORY
        // ======================================================

        const matchesCategory =
          this.selectedCategory === 'ALL' ||

          this.safeString(
            lead.categoryName
          ) ===
          this.selectedCategory
            .toLowerCase();


        // ======================================================
        // SOURCE
        // ======================================================

        const matchesSource =
          this.selectedSource === 'ALL' ||

          this.safeString(
            lead.sourceName
          ) ===
          this.selectedSource
            .toLowerCase();


        // ======================================================
        // EXECUTIVE
        // ======================================================

        const matchesExecutive =
          this.selectedExecutive === 'ALL' ||

          this.safeString(
            lead.assignedUserName
          ) ===
          this.selectedExecutive
            .toLowerCase();


        // ======================================================
        // FINAL RESULT
        // ======================================================

        return (
          matchesSearch &&
          matchesStatus &&
          matchesPriority &&
          matchesCategory &&
          matchesSource &&
          matchesExecutive
        );

      }
    );

  }


  // ==========================================================
  // SEARCH
  // ==========================================================

  onSearch(): void {

    this.applyFilters();

  }


  // ==========================================================
  // FILTER CHANGE
  // ==========================================================

  onFilterChange(): void {

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
  // CLEAR ALL FILTERS
  // ==========================================================

  clearAllFilters(): void {

    this.searchKeyword = '';

    this.selectedStatus = 'ALL';

    this.selectedPriority = 'ALL';

    this.selectedCategory = 'ALL';

    this.selectedSource = 'ALL';

    this.selectedExecutive = 'ALL';

    this.applyFilters();

  }


  // ==========================================================
  // TOTAL COUNT
  // ==========================================================

  getTotalCount(): number {

    return this.leads.length;

  }


  // ==========================================================
  // NEW LEADS COUNT
  // ==========================================================

  getNewCount(): number {

    return this.leads.filter(
      lead =>
        lead.leadStatus === LeadStatus.NEW
    ).length;

  }


  // ==========================================================
  // FOLLOW-UP COUNT
  // ==========================================================

  getFollowUpCount(): number {

    return this.leads.filter(
      lead =>
        lead.leadStatus === LeadStatus.FOLLOW_UP
    ).length;

  }


  // ==========================================================
  // HOT LEADS COUNT
  // ==========================================================

  getHotCount(): number {

    return this.leads.filter(
      lead =>
        lead.leadPriority === LeadPriority.HOT
    ).length;

  }


  // ==========================================================
  // WON LEADS COUNT
  // ==========================================================

  getWonCount(): number {

    return this.leads.filter(
      lead =>
        lead.leadStatus === LeadStatus.WON
    ).length;

  }


  // ==========================================================
  // CATEGORY OPTIONS
  // ==========================================================

  getCategories(): string[] {

    return this.getUniqueValues(
      this.leads.map(
        lead => lead.categoryName
      )
    );

  }


  // ==========================================================
  // SOURCE OPTIONS
  // ==========================================================

  getSources(): string[] {

    return this.getUniqueValues(
      this.sources.map(
        source => source.sourceName
      )
    );

  }


  // ==========================================================
  // EXECUTIVE OPTIONS
  // ==========================================================

  getExecutives(): string[] {

    return this.getUniqueValues(
      this.executives.map(
        executive => executive.fullName
      )
    );

  }


  // ==========================================================
  // GET UNIQUE VALUES
  // ==========================================================

  private getUniqueValues(
    values: (string | null | undefined)[]
  ): string[] {

    return [
      ...new Set(

        values

          .filter(
            (
              value
            ): value is string =>
              !!value &&
              value.trim().length > 0
          )

          .map(
            value =>
              value.trim()
          )

      )
    ].sort(
      (a, b) =>
        a.localeCompare(b)
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

    return String(
      value
    )
      .trim()
      .toLowerCase();

  }


  // ==========================================================
  // STATUS HELPERS
  // ==========================================================

  isNew(
    lead: CustomerLeadResponse
  ): boolean {

    return (
      lead.leadStatus ===
      LeadStatus.NEW
    );

  }


  isFollowUp(
    lead: CustomerLeadResponse
  ): boolean {

    return (
      lead.leadStatus ===
      LeadStatus.FOLLOW_UP
    );

  }


  isWon(
    lead: CustomerLeadResponse
  ): boolean {

    return (
      lead.leadStatus ===
      LeadStatus.WON
    );

  }


  isLost(
    lead: CustomerLeadResponse
  ): boolean {

    return (
      lead.leadStatus ===
      LeadStatus.LOST
    );

  }


  // ==========================================================
  // PRIORITY HELPERS
  // ==========================================================

  isHot(
    lead: CustomerLeadResponse
  ): boolean {

    return (
      lead.leadPriority ===
      LeadPriority.HOT
    );

  }


  isWarm(
    lead: CustomerLeadResponse
  ): boolean {

    return (
      lead.leadPriority ===
      LeadPriority.WARM
    );

  }


  isCold(
    lead: CustomerLeadResponse
  ): boolean {

    return (
      lead.leadPriority ===
      LeadPriority.COLD
    );

  }


  // ==========================================================
  // VIEW LEAD
  // ==========================================================

  viewLead(
    lead: CustomerLeadResponse
  ): void {

    if (!lead || !lead.leadId) {
      return;
    }

    this.router.navigate([
      '/admin/leads/view',
      lead.leadId
    ]);

  }


  // ==========================================================
  // EDIT LEAD
  // ==========================================================

  editLead(
    lead: CustomerLeadResponse
  ): void {

    if (!lead || !lead.leadId) {
      return;
    }

    this.router.navigate([
      '/admin/leads/edit',
      lead.leadId
    ]);

  }


  // ==========================================================
  // ADD NEW LEAD
  // ==========================================================

  addLead(): void {

    this.router.navigate([
      '/admin/leads/add'
    ]);

  }


  // ==========================================================
  // DELETE LEAD
  // ==========================================================

  deleteLead(
    lead: CustomerLeadResponse
  ): void {

    if (!lead || !lead.leadId) {
      return;
    }


    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${lead.fullName}"?`
      );


    if (!confirmed) {
      return;
    }


    this.isLoading = true;

    this.errorMessage = '';

    this.successMessage = '';


    this.customerLeadService
      .deleteLead(
        lead.leadId
      )
      .subscribe({

        // ======================================================
        // SUCCESS
        // ======================================================

        next: () => {

          this.successMessage =
            'Lead deleted successfully.';

          this.loadLeads();


          setTimeout(() => {

            this.successMessage = '';

          }, 4000);

        },


        // ======================================================
        // ERROR
        // ======================================================

        error: (error) => {

          console.error(
            'Error deleting lead:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to delete the lead. Please try again.';

          this.isLoading = false;

        }

      });

  }

}