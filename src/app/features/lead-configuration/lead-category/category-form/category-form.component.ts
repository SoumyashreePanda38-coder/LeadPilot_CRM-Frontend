import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { LeadCategoryService } from '../../../../core/services/lead-category.service';
import { LeadCategoryRequest } from '../../../../core/models/lead-category-request';
import { LeadCategoryResponse } from '../../../../core/models/lead-category-response';
import { LeadCategoryStatus } from '../../../../core/models/lead-category-status.enum';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.css']
})
export class CategoryFormComponent implements OnInit {

  // ==========================================================
  // FORM
  // ==========================================================

  categoryForm!: FormGroup;

  // ==========================================================
  // MODE
  // ==========================================================

  isEditMode = false;

  categoryId: number | null = null;

  // ==========================================================
  // PAGE STATE
  // ==========================================================

  loading = false;

  submitting = false;

  errorMessage = '';

  successMessage = '';

  // ==========================================================
  // STATUS
  // ==========================================================

  readonly CategoryStatus = LeadCategoryStatus;

  statusOptions = [
    {
      label: 'Active',
      value: LeadCategoryStatus.ACTIVE
    },
    {
      label: 'Inactive',
      value: LeadCategoryStatus.INACTIVE
    }
  ];

  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(
    private fb: FormBuilder,
    private leadCategoryService: LeadCategoryService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  // ==========================================================
  // INITIALIZATION
  // ==========================================================

  ngOnInit(): void {

    this.initializeForm();

    this.checkEditMode();
  }

  // ==========================================================
  // INITIALIZE FORM
  // ==========================================================

  private initializeForm(): void {

    this.categoryForm = this.fb.group({

      categoryName: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],

      description: [
        '',
        [
          Validators.maxLength(500)
        ]
      ],

      displayOrder: [
        null,
        [
          Validators.min(1)
        ]
      ],

      status: [
        LeadCategoryStatus.ACTIVE,
        [
          Validators.required
        ]
      ]

    });
  }

  // ==========================================================
  // CHECK ADD / EDIT MODE
  // ==========================================================

  private checkEditMode(): void {

    const id = this.route.snapshot.paramMap.get('categoryId');

    if (id) {

      this.categoryId = Number(id);

      this.isEditMode = true;

      this.loadCategory(this.categoryId);

    } else {

      this.isEditMode = false;
    }
  }

  // ==========================================================
  // LOAD CATEGORY FOR EDIT
  // ==========================================================

  private loadCategory(categoryId: number): void {

    this.loading = true;

    this.errorMessage = '';

    this.leadCategoryService
      .getCategoryById(categoryId)
      .subscribe({

        next: (category: LeadCategoryResponse) => {

          this.categoryForm.patchValue({

            categoryName: category.categoryName,

            description: category.description,

            displayOrder: category.displayOrder,

            status: category.status

          });

          this.loading = false;
        },

        error: (error) => {

          console.error(
            'Error loading lead category:',
            error
          );

          this.errorMessage =
            'Unable to load category details. Please try again.';

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

    if (this.categoryForm.invalid) {

      this.categoryForm.markAllAsTouched();

      return;
    }

    // --------------------------------------------------------
    // Prevent duplicate submission
    // --------------------------------------------------------

    if (this.submitting) {
      return;
    }

    // --------------------------------------------------------
    // Prepare request
    // --------------------------------------------------------

    const request: LeadCategoryRequest =
      this.categoryForm.value;

    this.submitting = true;

    // --------------------------------------------------------
    // EDIT
    // --------------------------------------------------------

    if (this.isEditMode && this.categoryId !== null) {

      this.updateCategory(
        this.categoryId,
        request
      );

      return;
    }

    // --------------------------------------------------------
    // CREATE
    // --------------------------------------------------------

    this.createCategory(request);
  }

  // ==========================================================
  // CREATE CATEGORY
  // ==========================================================

  private createCategory(
    request: LeadCategoryRequest
  ): void {

    this.leadCategoryService
      .addCategory(request)
      .subscribe({

        next: (response: LeadCategoryResponse) => {

          console.log(
            'Category created successfully:',
            response
          );

          this.successMessage =
            'Lead category created successfully.';

          this.submitting = false;

          // --------------------------------------------------
          // Navigate back to category list
          // --------------------------------------------------

          setTimeout(() => {

            this.goBack();

          }, 800);
        },

        error: (error) => {

          console.error(
            'Error creating lead category:',
            error
          );

          this.errorMessage =
            this.getErrorMessage(
              error,
              'Unable to create lead category.'
            );

          this.submitting = false;
        }

      });
  }

  // ==========================================================
  // UPDATE CATEGORY
  // ==========================================================

  private updateCategory(
    categoryId: number,
    request: LeadCategoryRequest
  ): void {

    this.leadCategoryService
      .updateCategory(
        categoryId,
        request
      )
      .subscribe({

        next: (response: LeadCategoryResponse) => {

          console.log(
            'Category updated successfully:',
            response
          );

          this.successMessage =
            'Lead category updated successfully.';

          this.submitting = false;

          // --------------------------------------------------
          // Navigate back to category list
          // --------------------------------------------------

          setTimeout(() => {

            this.goBack();

          }, 800);
        },

        error: (error) => {

          console.error(
            'Error updating lead category:',
            error
          );

          this.errorMessage =
            this.getErrorMessage(
              error,
              'Unable to update lead category.'
            );

          this.submitting = false;
        }

      });
  }

  // ==========================================================
  // CANCEL
  // ==========================================================

  cancel(): void {

    this.goBack();
  }

  // ==========================================================
  // GO BACK TO CATEGORY LIST
  // ==========================================================

  private goBack(): void {

    this.router.navigate([
      '/admin/lead-configuration/category'
    ]);
  }

  // ==========================================================
  // FORM FIELD HELPERS
  // ==========================================================

  get categoryName() {
    return this.categoryForm.get('categoryName');
  }

  get description() {
    return this.categoryForm.get('description');
  }

  get displayOrder() {
    return this.categoryForm.get('displayOrder');
  }

  get status() {
    return this.categoryForm.get('status');
  }

  // ==========================================================
  // FIELD VALIDATION
  // ==========================================================

  isFieldInvalid(
    fieldName: string
  ): boolean {

    const field =
      this.categoryForm.get(fieldName);

    return !!(
      field &&
      field.invalid &&
      (field.touched || field.dirty)
    );
  }

  // ==========================================================
  // ERROR MESSAGE
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
      error?.error?.error
    ) {

      return error.error.error;
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

    this.errorMessage = '';

    this.successMessage = '';
  }

  // ==========================================================
  // RESET FORM
  // ==========================================================

  resetForm(): void {

    if (this.isEditMode) {

      if (this.categoryId !== null) {

        this.loadCategory(
          this.categoryId
        );
      }

      return;
    }

    this.categoryForm.reset({

      categoryName: '',

      description: '',

      displayOrder: null,

      status: LeadCategoryStatus.ACTIVE

    });

    this.clearMessages();
  }
}