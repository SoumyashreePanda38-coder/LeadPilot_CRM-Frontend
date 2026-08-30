import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { CustomerLeadService } from '../../../core/services/customer-lead.service';
import { LeadCategoryService } from '../../../core/services/lead-category.service';
import { LeadSubCategoryService } from '../../../core/services/lead-subcategory.service';
import { LeadSourceService } from '../../../core/services/lead-source.service';
import { UserManagementService } from '../../../core/services/user-management.service';

import { CustomerLeadRequest } from '../../../core/models/customer-lead-request';
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
  selector: 'app-add-lead',
  templateUrl: './add-lead.component.html',
  styleUrls: ['./add-lead.component.css']
})
export class AddLeadComponent implements OnInit {

  // ==========================================================
  // FORM MODEL
  // ==========================================================

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
    private customerLeadService: CustomerLeadService,
    private leadCategoryService: LeadCategoryService,
    private leadSubCategoryService: LeadSubCategoryService,
    private leadSourceService: LeadSourceService,
    private userManagementService: UserManagementService,
    private router: Router
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

    this.loadFormData();

  }


  // ==========================================================
  // LOAD FORM DATA
  // ==========================================================

  loadFormData(): void {

    this.isLoading = true;

    this.loadCategories();

    this.loadSources();

    this.loadExecutives();

    this.isLoading = false;

  }


  // ==========================================================
  // LOAD CATEGORIES
  // ==========================================================

  loadCategories(): void {

    this.leadCategoryService
      .getAllCategories()
      .subscribe({

        next: (data) => {

          this.categories = data || [];

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
    categoryId: number | null
  ): void {

    this.subCategories = [];

    this.lead.subCategoryId = null;

    if (!categoryId) {

      return;

    }

    this.loadingSubCategories = true;

    this.leadSubCategoryService
      .getSubCategoriesByCategory(categoryId)
      .subscribe({

        next: (data) => {

          this.subCategories = data || [];

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

    this.loadSubCategories(
      this.lead.categoryId
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

          this.sources = data || [];

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
  // WATER RIPPLE EFFECT
  // ==========================================================

  createRipple(event: MouseEvent): void {

    /*
     * Do not create another ripple
     * while the lead is being saved.
     */

    if (this.isSaving) {

      return;

    }


    /*
     * Get the Create Lead button.
     */

    const button =
      event.currentTarget as HTMLElement;

    if (!button) {

      return;

    }


    /*
     * Create ripple element.
     */

    const ripple =
      document.createElement('span');

    ripple.classList.add(
      'water-ripple'
    );


    /*
     * Get button dimensions.
     */

    const rect =
      button.getBoundingClientRect();


    /*
     * Make ripple large enough
     * to cover the complete button.
     */

    const size =
      Math.max(
        rect.width,
        rect.height
      ) * 1.8;


    /*
     * Calculate click position.
     */

    const x =
      event.clientX -
      rect.left -
      size / 2;

    const y =
      event.clientY -
      rect.top -
      size / 2;


    /*
     * Apply ripple position.
     */

    ripple.style.width =
      `${size}px`;

    ripple.style.height =
      `${size}px`;

    ripple.style.left =
      `${x}px`;

    ripple.style.top =
      `${y}px`;


    /*
     * Add ripple to button.
     */

    button.appendChild(ripple);


    /*
     * Remove ripple after animation.
     */

    setTimeout(() => {

      if (ripple.parentNode) {

        ripple.remove();

      }

    }, 1000);

  }


  // ==========================================================
  // CREATE LEAD
  // ==========================================================

  saveLead(form: NgForm): void {

    this.errorMessage = '';

    this.successMessage = '';


    // ----------------------------------------------------------
    // VALIDATION
    // ----------------------------------------------------------

    if (form.invalid) {

      form.control.markAllAsTouched();

      this.errorMessage =
        'Please fill all required fields correctly.';

      /*
       * The click handler already creates
       * the ripple animation.
       */

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
      .createLead(payload)
      .subscribe({

        // ======================================================
        // SUCCESS
        // ======================================================

        next: (response) => {

          this.isSaving = false;

          this.successMessage =
            'Customer lead created successfully.';


          /*
           * Navigate after a short delay
           * so the success message can be seen.
           */

          setTimeout(() => {

            this.router.navigate([
              '/admin/leads'
            ]);

          }, 1000);

        },


        // ======================================================
        // ERROR
        // ======================================================

        error: (error) => {

          console.error(
            'Failed to create customer lead',
            error
          );

          this.isSaving = false;

          this.errorMessage =
            error?.error?.message ||
            'Failed to create customer lead. Please try again.';

        }

      });

  }


  // ==========================================================
  // RESET FORM
  // ==========================================================

  resetForm(form: NgForm): void {

    const defaultLead =
      this.createDefaultLead();

    form.resetForm(defaultLead);

    this.lead = defaultLead;

    this.subCategories = [];

    this.errorMessage = '';

    this.successMessage = '';

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

      .replace(/_/g, ' ')

      .toLowerCase()

      .replace(
        /\b\w/g,
        char => char.toUpperCase()
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

      .replace(/_/g, '-');

  }


  // ==========================================================
  // PRIORITY CLASS
  // ==========================================================

  getPriorityClass(
    priority: string
  ): string {

    return priority

      .toLowerCase()

      .replace(/_/g, '-');

  }

}