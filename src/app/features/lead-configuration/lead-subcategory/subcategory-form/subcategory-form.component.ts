import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { LeadSubCategoryService } from '../../../../core/services/lead-subcategory.service';
import { LeadCategoryService } from '../../../../core/services/lead-category.service';

import { LeadSubCategoryRequest } from '../../../../core/models/lead-subcategory-request';
import { LeadSubCategoryResponse } from '../../../../core/models/lead-subcategory-response';
import { LeadCategoryResponse } from '../../../../core/models/lead-category-response';

import { LeadCategoryStatus } from '../../../../core/models/lead-category-status.enum';


@Component({
  selector: 'app-subcategory-form',
  templateUrl: './subcategory-form.component.html',
  styleUrls: ['./subcategory-form.component.css']
})
export class SubcategoryFormComponent implements OnInit {

  // ==========================================================
  // FORM
  // ==========================================================

  subcategoryForm!: FormGroup;


  // ==========================================================
  // CATEGORY DATA
  // ==========================================================

  categories: LeadCategoryResponse[] = [];


  // ==========================================================
  // EDIT MODE
  // ==========================================================

  isEditMode = false;

  subCategoryId: number | null = null;


  // ==========================================================
  // LOADING / MESSAGES
  // ==========================================================

  loading = false;

  successMessage = '';

  errorMessage = '';


  // ==========================================================
  // STATUS ENUM
  // Used directly in HTML
  // ==========================================================

  readonly CategoryStatus = LeadCategoryStatus;


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(
    private fb: FormBuilder,
    private leadSubCategoryService: LeadSubCategoryService,
    private leadCategoryService: LeadCategoryService,
    private route: ActivatedRoute,
    private router: Router
  ) {}


  // ==========================================================
  // LIFECYCLE
  // ==========================================================

  ngOnInit(): void {

    this.initializeForm();

    this.loadCategories();

    this.checkEditMode();

  }


  // ==========================================================
  // INITIALIZE FORM
  // ==========================================================

  private initializeForm(): void {

    this.subcategoryForm = this.fb.group({

      categoryId: [
        '',
        Validators.required
      ],

      subCategoryName: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],

      description: [
        '',
        Validators.maxLength(500)
      ],

      displayOrder: [
        1,
        [
          Validators.required,
          Validators.min(1)
        ]
      ],

      status: [
        LeadCategoryStatus.ACTIVE,
        Validators.required
      ]

    });

  }


  // ==========================================================
  // CHECK EDIT MODE
  // ==========================================================

  private checkEditMode(): void {

    const id = this.route.snapshot.paramMap.get('id');

    if (id) {

      this.subCategoryId = Number(id);

      if (!isNaN(this.subCategoryId)) {

        this.isEditMode = true;

        this.loadSubCategory(this.subCategoryId);

      }

    }

  }


  // ==========================================================
  // LOAD CATEGORIES
  // ==========================================================

  loadCategories(): void {

    this.leadCategoryService
      .getAllCategories()
      .subscribe({

        next: (response: LeadCategoryResponse[]) => {

          this.categories = response;

        },

        error: (error) => {

          console.error(
            'Error loading lead categories:',
            error
          );

          this.errorMessage =
            'Unable to load lead categories. Please try again.';

        }

      });

  }


  // ==========================================================
  // LOAD SUBCATEGORY FOR EDIT
  // ==========================================================

  private loadSubCategory(
    subCategoryId: number
  ): void {

    this.loading = true;

    this.clearMessages();

    this.leadSubCategoryService
      .getSubCategoryById(subCategoryId)
      .subscribe({

        next: (
          response: LeadSubCategoryResponse
        ) => {

          this.subcategoryForm.patchValue({

            categoryId: response.categoryId,

            subCategoryName:
              response.subCategoryName,

            description:
              response.description || '',

            displayOrder:
              response.displayOrder || 1,

            status:
              response.status

          });

          this.loading = false;

        },

        error: (error) => {

          console.error(
            'Error loading subcategory:',
            error
          );

          this.errorMessage =
            'Unable to load subcategory details. Please try again.';

          this.loading = false;

        }

      });

  }


  // ==========================================================
  // FORM SUBMIT
  // ==========================================================

  onSubmit(): void {

    this.clearMessages();

    // --------------------------------------------------------
    // Validate form
    // --------------------------------------------------------

    if (this.subcategoryForm.invalid) {

      this.markFormTouched();

      this.errorMessage =
        'Please correct the highlighted fields before submitting.';

      return;

    }


    // --------------------------------------------------------
    // Prevent duplicate submission
    // --------------------------------------------------------

    if (this.loading) {
      return;
    }


    // --------------------------------------------------------
    // Prepare request
    // --------------------------------------------------------

    const request: LeadSubCategoryRequest = {

      categoryId:
        Number(
          this.subcategoryForm.value.categoryId
        ),

      subCategoryName:
        this.subcategoryForm.value.subCategoryName
          ?.trim(),

      description:
        this.subcategoryForm.value.description
          ?.trim() || '',

      displayOrder:
        Number(
          this.subcategoryForm.value.displayOrder
        ),

      status:
        this.subcategoryForm.value.status

    };


    this.loading = true;


    // ========================================================
    // EDIT
    // ========================================================

    if (
      this.isEditMode &&
      this.subCategoryId
    ) {

      this.leadSubCategoryService
        .updateSubCategory(
          this.subCategoryId,
          request
        )
        .subscribe({

          next: (
            response: LeadSubCategoryResponse
          ) => {

            console.log(
              'Subcategory updated:',
              response
            );

            this.loading = false;

            this.successMessage =
              'Subcategory updated successfully.';

            setTimeout(() => {

              this.router.navigate([
                '/admin/lead-configuration/subcategory'
              ]);

            }, 1000);

          },

          error: (error) => {

            console.error(
              'Error updating subcategory:',
              error
            );

            this.loading = false;

            this.errorMessage =
              this.getErrorMessage(
                error,
                'Unable to update subcategory. Please try again.'
              );

          }

        });

      return;

    }


    // ========================================================
    // CREATE
    // ========================================================

    this.leadSubCategoryService
      .createSubCategory(request)
      .subscribe({

        next: (
          response: LeadSubCategoryResponse
        ) => {

          console.log(
            'Subcategory created:',
            response
          );

          this.loading = false;

          this.successMessage =
            'Subcategory created successfully.';

          setTimeout(() => {

            this.router.navigate([
              '/admin/lead-configuration/subcategory'
            ]);

          }, 1000);

        },

        error: (error: any) => {

          console.error(
            'Error creating subcategory:',
            error
          );

          this.loading = false;

          this.errorMessage =
            this.getErrorMessage(
              error,
              'Unable to create subcategory. Please try again.'
            );

        }

      });

  }


  // ==========================================================
  // MARK FORM AS TOUCHED
  // ==========================================================

  private markFormTouched(): void {

    Object.keys(
      this.subcategoryForm.controls
    ).forEach(controlName => {

      const control =
        this.subcategoryForm.get(controlName);

      control?.markAsTouched();

      control?.updateValueAndValidity();

    });

  }


  // ==========================================================
  // RESET FORM
  // ==========================================================

  resetForm(): void {

    this.clearMessages();

    // --------------------------------------------------------
    // EDIT MODE
    // --------------------------------------------------------

    if (
      this.isEditMode &&
      this.subCategoryId
    ) {

      this.loadSubCategory(
        this.subCategoryId
      );

      return;

    }


    // --------------------------------------------------------
    // ADD MODE
    // --------------------------------------------------------

    this.subcategoryForm.reset({

      categoryId: '',

      subCategoryName: '',

      description: '',

      displayOrder: 1,

      status: LeadCategoryStatus.ACTIVE

    });

    this.subcategoryForm.markAsPristine();

    this.subcategoryForm.markAsUntouched();

  }


  // ==========================================================
  // CANCEL
  // ==========================================================

  cancel(): void {

    if (this.loading) {
      return;
    }

    this.router.navigate([
      '/admin/lead-configuration/subcategory'
    ]);

  }


  // ==========================================================
  // SELECTED CATEGORY NAME
  // Used by LIVE PREVIEW
  // ==========================================================

  getSelectedCategoryName(): string {

    const categoryId =
      this.subcategoryForm.get(
        'categoryId'
      )?.value;

    if (
      categoryId === null ||
      categoryId === undefined ||
      categoryId === ''
    ) {

      return '';

    }


    const category =
      this.categories.find(
        item =>
          item.categoryId === Number(categoryId)
      );


    return category
      ? category.categoryName
      : '';

  }


  // ==========================================================
  // FORM GETTERS
  // Used directly in HTML
  // ==========================================================

  get categoryId() {

    return this.subcategoryForm.get(
      'categoryId'
    );

  }


  get subCategoryName() {

    return this.subcategoryForm.get(
      'subCategoryName'
    );

  }


  get description() {

    return this.subcategoryForm.get(
      'description'
    );

  }


  get displayOrder() {

    return this.subcategoryForm.get(
      'displayOrder'
    );

  }


  get status() {

    return this.subcategoryForm.get(
      'status'
    );

  }


  // ==========================================================
  // ERROR MESSAGE HELPER
  // ==========================================================

  private getErrorMessage(
    error: any,
    defaultMessage: string
  ): string {

    if (
      error?.error?.message
    ) {

      return error.error.message;

    }


    if (
      typeof error?.error === 'string'
    ) {

      return error.error;

    }


    if (
      error?.message
    ) {

      return error.message;

    }


    return defaultMessage;

  }


  // ==========================================================
  // CLEAR MESSAGES
  // ==========================================================

  private clearMessages(): void {

    this.successMessage = '';

    this.errorMessage = '';

  }

}