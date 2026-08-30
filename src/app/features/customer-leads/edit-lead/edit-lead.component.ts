import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { CustomerLeadService } from '../../../core/services/customer-lead.service';
import { LeadCategoryService } from '../../../core/services/lead-category.service';
import { LeadSubCategoryService } from '../../../core/services/lead-subcategory.service';
import { LeadSourceService } from '../../../core/services/lead-source.service';
import { UserManagementService } from '../../../core/services/user-management.service';

import { CustomerLeadRequest } from '../../../core/models/customer-lead-request';
import { CustomerLeadResponse } from '../../../core/models/customer-lead-response';
import { LeadCategoryResponse } from '../../../core/models/lead-category-response';
import { LeadSubCategoryResponse } from '../../../core/models/lead-subcategory-response';
import { LeadSourceResponse } from '../../../core/models/lead-source-response';
import { UserManagementResponse } from '../../../core/models/user-management-response';

import { LeadStatus } from '../../../core/models/lead-status.enum';
import { LeadPriority } from '../../../core/models/lead-priority.enum';
import { Role } from '../../../core/models/role';
import { UserStatus } from '../../../core/models/user-status';


type LeadFormState = Omit<
  CustomerLeadRequest,
  'age' |
  'categoryId' |
  'subCategoryId' |
  'leadSourceId' |
  'assignedUserId'
> & {
  age: number | null;
  categoryId: number | null;
  subCategoryId: number | null;
  leadSourceId: number | null;
  assignedUserId: number | null;
};


@Component({
  selector: 'app-edit-lead',
  templateUrl: './edit-lead.component.html',
  styleUrls: ['./edit-lead.component.css']
})
export class EditLeadComponent implements OnInit {

  // ==========================================================
  // ROUTE / FORM STATE
  // ==========================================================

  leadId: number | null = null;

  lead: LeadFormState = this.createDefaultLead();


  // ==========================================================
  // DROPDOWN DATA
  // ==========================================================

  categories: LeadCategoryResponse[] = [];

  subCategories: LeadSubCategoryResponse[] = [];

  sources: LeadSourceResponse[] = [];

  executives: UserManagementResponse[] = [];


  // ==========================================================
  // ENUMS
  // ==========================================================

  leadStatuses = Object.values(LeadStatus);

  leadPriorities = Object.values(LeadPriority);


  // ==========================================================
  // UI STATE
  // ==========================================================

  isLoading = false;

  isSaving = false;

  errorMessage = '';

  successMessage = '';

  loadingSubCategories = false;


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(
    private route: ActivatedRoute,
    private router: Router,

    private customerLeadService: CustomerLeadService,
    private leadCategoryService: LeadCategoryService,
    private leadSubCategoryService: LeadSubCategoryService,
    private leadSourceService: LeadSourceService,
    private userManagementService: UserManagementService
  ) {}


  // ==========================================================
  // DEFAULT LEAD
  // ==========================================================

  private createDefaultLead(): LeadFormState {

    return {

      fullName: '',

      age: null,

      email: '',

      phoneNumber: '',

      address: '',

      city: '',

      state: '',

      pincode: '',

      categoryId: null,

      subCategoryId: null,

      leadSourceId: null,

      leadStatus: LeadStatus.NEW,

      leadPriority: LeadPriority.WARM,

      assignedUserId: null

    };

  }


  // ==========================================================
  // INIT
  // ==========================================================

  ngOnInit(): void {

    this.route.paramMap.subscribe((params) => {

      const idParam = params.get('id');

      const leadId = idParam
        ? Number(idParam)
        : NaN;


      // --------------------------------------------------------
      // VALIDATE ID
      // --------------------------------------------------------

      if (
        Number.isNaN(leadId) ||
        leadId <= 0
      ) {

        this.errorMessage =
          'Invalid lead id.';

        return;
      }


      // --------------------------------------------------------
      // SET LEAD ID
      // --------------------------------------------------------

      this.leadId = leadId;


      // --------------------------------------------------------
      // LOAD DATA
      // --------------------------------------------------------

      this.loadFormData();

      this.loadLeadById(leadId);

    });

  }


  // ==========================================================
  // LOAD FORM DATA
  // ==========================================================

  loadFormData(): void {

    this.isLoading = true;

    this.loadCategories();

    this.loadSources();

    this.loadExecutives();

  }


  // ==========================================================
  // LOAD LEAD BY ID
  // ==========================================================

  loadLeadById(leadId: number): void {

    this.customerLeadService
      .getLeadById(leadId)
      .subscribe({

        next: (data: CustomerLeadResponse) => {

          const response =
            data || {} as CustomerLeadResponse;


          // ----------------------------------------------------
          // POPULATE FORM
          // ----------------------------------------------------

          this.lead = {

            fullName:
              response.fullName ?? '',

            age:
              response.age ?? null,

            email:
              response.email ?? '',

            phoneNumber:
              response.phoneNumber ?? '',

            address:
              response.address ?? '',

            city:
              response.city ?? '',

            state:
              response.state ?? '',

            pincode:
              response.pincode ?? '',

            categoryId:
              response.categoryId ?? null,

            subCategoryId:
              response.subCategoryId ?? null,

            leadSourceId:
              response.leadSourceId ?? null,

            leadStatus:
              response.leadStatus ??
              LeadStatus.NEW,

            leadPriority:
              response.leadPriority ??
              LeadPriority.WARM,

            assignedUserId:
              response.assignedUserId ?? null

          };


          // ----------------------------------------------------
          // LOAD SUBCATEGORIES
          //
          // false = do NOT clear existing subcategory
          // ----------------------------------------------------

          this.loadSubCategories(
            this.lead.categoryId,
            false
          );


          this.isLoading = false;

        },


        error: (error) => {

          console.error(
            'Failed to load customer lead',
            error
          );

          this.isLoading = false;

          this.errorMessage =
            error?.error?.message ||
            'Unable to load customer lead details.';

        }

      });

  }


  // ==========================================================
  // LOAD CATEGORIES
  // ==========================================================

  loadCategories(): void {

    this.leadCategoryService
      .getAllCategories()
      .subscribe({

        next: (data) => {

          this.categories =
            data || [];

        },

        error: (error) => {

          console.error(
            'Failed to load categories',
            error
          );

          this.errorMessage =
            'Unable to load lead categories.';

        }

      });

  }


  // ==========================================================
  // LOAD SUBCATEGORIES
  // ==========================================================

  loadSubCategories(
    categoryId: number | null,
    resetSubCategory: boolean = true
  ): void {

    // ----------------------------------------------------------
    // CLEAR AVAILABLE SUBCATEGORIES
    // ----------------------------------------------------------

    this.subCategories = [];


    // ----------------------------------------------------------
    // RESET ONLY WHEN REQUIRED
    // ----------------------------------------------------------

    if (resetSubCategory) {

      this.lead.subCategoryId = null;

    }


    // ----------------------------------------------------------
    // NO CATEGORY SELECTED
    // ----------------------------------------------------------

    if (!categoryId) {

      this.loadingSubCategories = false;

      return;

    }


    // ----------------------------------------------------------
    // START LOADING
    // ----------------------------------------------------------

    this.loadingSubCategories = true;


    // ----------------------------------------------------------
    // API CALL
    // ----------------------------------------------------------

    this.leadSubCategoryService
      .getSubCategoriesByCategory(categoryId)
      .subscribe({

        next: (data) => {

          this.subCategories =
            data || [];

          this.loadingSubCategories = false;

        },

        error: (error) => {

          console.error(
            'Failed to load subcategories',
            error
          );

          this.loadingSubCategories = false;

          this.errorMessage =
            'Unable to load subcategories.';

        }

      });

  }


  // ==========================================================
  // CATEGORY CHANGE
  // ==========================================================

  onCategoryChange(): void {

    // When user manually changes category,
    // reset the previous subcategory.

    this.loadSubCategories(
      this.lead.categoryId,
      true
    );

  }


  // ==========================================================
  // LOAD SOURCES
  // ==========================================================

  loadSources(): void {

    this.leadSourceService
      .getAllLeadSources()
      .subscribe({

        next: (data) => {

          this.sources =
            data || [];

        },

        error: (error) => {

          console.error(
            'Failed to load lead sources',
            error
          );

          this.errorMessage =
            'Unable to load lead sources.';

        }

      });

  }


  // ==========================================================
  // LOAD EXECUTIVES
  // ==========================================================

  loadExecutives(): void {

    this.userManagementService
      .getAllExecutives()
      .subscribe({

        next: (data) => {

          this.executives =
            (data || []).filter(

              user =>
                user.role === Role.EXECUTIVE &&
                user.status === UserStatus.ACTIVE

            );

        },

        error: (error) => {

          console.error(
            'Failed to load executives',
            error
          );

          this.errorMessage =
            'Unable to load executives.';

        }

      });

  }


  // ==========================================================
  // UPDATE LEAD
  // ==========================================================

  updateLead(form: NgForm): void {

    // ----------------------------------------------------------
    // CLEAR PREVIOUS MESSAGES
    // ----------------------------------------------------------

    this.errorMessage = '';

    this.successMessage = '';


    // ----------------------------------------------------------
    // VALIDATION
    // ----------------------------------------------------------

    if (form.invalid) {

      form.control.markAllAsTouched();

      this.errorMessage =
        'Please fill all required fields correctly.';

      return;

    }


    // ----------------------------------------------------------
    // CHECK LEAD ID
    // ----------------------------------------------------------

    if (!this.leadId) {

      this.errorMessage =
        'Lead id is missing.';

      return;

    }


    // ----------------------------------------------------------
    // PREVENT DOUBLE SUBMISSION
    // ----------------------------------------------------------

    if (this.isSaving) {

      return;

    }


    // ----------------------------------------------------------
    // START SAVING
    // ----------------------------------------------------------

    this.isSaving = true;


    // ----------------------------------------------------------
    // PREPARE PAYLOAD
    // ----------------------------------------------------------

    const payload: CustomerLeadRequest = {

      ...this.lead,

      age:
        this.lead.age ?? undefined,

      email:
        this.lead.email || undefined,

      address:
        this.lead.address || undefined,

      city:
        this.lead.city || undefined,

      state:
        this.lead.state || undefined,

      pincode:
        this.lead.pincode || undefined,

      categoryId:
        this.lead.categoryId ?? 0,

      subCategoryId:
        this.lead.subCategoryId ?? 0,

      leadSourceId:
        this.lead.leadSourceId ?? 0,

      assignedUserId:
        this.lead.assignedUserId ?? undefined

    };


    // ----------------------------------------------------------
    // API CALL
    // ----------------------------------------------------------

    this.customerLeadService
      .updateLead(
        this.leadId,
        payload
      )
      .subscribe({

        // ======================================================
        // SUCCESS
        // ======================================================

        next: () => {

          this.isSaving = false;

          this.successMessage =
            'Customer lead updated successfully.';


          // ----------------------------------------------------
          // NAVIGATE BACK TO LEAD LIST
          // ----------------------------------------------------

          setTimeout(() => {

            this.router.navigate([
              '/admin/leads'
            ]);

          }, 900);

        },


        // ======================================================
        // ERROR
        // ======================================================

        error: (error) => {

          console.error(
            'Failed to update customer lead',
            error
          );

          this.isSaving = false;

          this.errorMessage =
            error?.error?.message ||
            'Failed to update customer lead. Please try again.';

        }

      });

  }


  // ==========================================================
  // RESET FORM
  // ==========================================================

  resetForm(form: NgForm): void {

    // ----------------------------------------------------------
    // Reset visual form first
    // ----------------------------------------------------------

    const defaultLead =
      this.createDefaultLead();

    form.resetForm(defaultLead);

    this.lead =
      defaultLead;

    this.subCategories = [];

    this.errorMessage = '';

    this.successMessage = '';


    // ----------------------------------------------------------
    // Reload original lead data
    // ----------------------------------------------------------

    if (this.leadId) {

      this.loadLeadById(
        this.leadId
      );

    }

  }


  // ==========================================================
  // RIPPLE EFFECT
  // ==========================================================

  createRipple(event: MouseEvent): void {

    // ----------------------------------------------------------
    // GET BUTTON
    // ----------------------------------------------------------

    const button =
      event.currentTarget as HTMLElement;


    if (!button || this.isSaving) {

      return;

    }


    // ----------------------------------------------------------
    // GET BUTTON POSITION
    // ----------------------------------------------------------

    const rect =
      button.getBoundingClientRect();


    // ----------------------------------------------------------
    // CALCULATE CLICK POSITION
    // ----------------------------------------------------------

    const x =
      event.clientX -
      rect.left;

    const y =
      event.clientY -
      rect.top;


    // ----------------------------------------------------------
    // SET RIPPLE POSITION
    // ----------------------------------------------------------

    button.style.setProperty(
      '--ripple-x',
      `${x}px`
    );

    button.style.setProperty(
      '--ripple-y',
      `${y}px`
    );


    // ----------------------------------------------------------
    // REMOVE PREVIOUS ANIMATION
    // ----------------------------------------------------------

    button.classList.remove(
      'ripple-active'
    );


    // ----------------------------------------------------------
    // FORCE BROWSER REFLOW
    //
    // This allows the animation to restart
    // even when the user clicks repeatedly.
    // ----------------------------------------------------------

    void button.offsetWidth;


    // ----------------------------------------------------------
    // START RIPPLE
    // ----------------------------------------------------------

    button.classList.add(
      'ripple-active'
    );


    // ----------------------------------------------------------
    // REMOVE CLASS AFTER ANIMATION
    // ----------------------------------------------------------

    setTimeout(() => {

      button.classList.remove(
        'ripple-active'
      );

    }, 900);

  }


  // ==========================================================
  // BACK
  // ==========================================================

  goBack(): void {

    this.router.navigate([
      '/admin/leads'
    ]);

  }


  // ==========================================================
  // DISPLAY ENUM
  // ==========================================================

  formatEnum(value: string): string {

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
  // STATUS CLASS
  // ==========================================================

  getStatusClass(
    status: string
  ): string {

    return status

      .toLowerCase()

      .replace(
        /_/g,
        '-'
      );

  }


  // ==========================================================
  // PRIORITY CLASS
  // ==========================================================

  getPriorityClass(
    priority: string
  ): string {

    return priority

      .toLowerCase()

      .replace(
        /_/g,
        '-'
      );

  }

}