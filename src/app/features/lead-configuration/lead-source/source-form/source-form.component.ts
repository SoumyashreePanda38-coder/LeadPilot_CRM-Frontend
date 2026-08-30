import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import {
  LeadSourceRequest
} from 'src/app/core/models/lead-source-request';

import {
  LeadSourceResponse
} from 'src/app/core/models/lead-source-response';

import {
  LeadSourceService
} from 'src/app/core/services/lead-source.service';

import {
  LeadCategoryStatus
} from 'src/app/core/models/lead-category-status.enum';


@Component({
  selector: 'app-source-form',
  templateUrl: './source-form.component.html',
  styleUrls: ['./source-form.component.css']
})
export class SourceFormComponent implements OnInit {

  // ==========================================================
  // FORM
  // ==========================================================

  sourceForm!: FormGroup;


  // ==========================================================
  // MODE
  // ==========================================================

  isEditMode: boolean = false;

  sourceId: number | null = null;


  // ==========================================================
  // UI STATE
  // ==========================================================

  isSaving: boolean = false;

  isLoading: boolean = false;


  // ==========================================================
  // MESSAGES
  // ==========================================================

  successMessage: string = '';

  errorMessage: string = '';


  // ==========================================================
  // STATUS ENUM
  // ==========================================================

  LeadCategoryStatus = LeadCategoryStatus;


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(
    private fb: FormBuilder,
    private leadSourceService: LeadSourceService,
    private route: ActivatedRoute,
    private router: Router
  ) {}


  // ==========================================================
  // INIT
  // ==========================================================

  ngOnInit(): void {

    this.createForm();

    this.checkEditMode();

  }


  // ==========================================================
  // CREATE FORM
  // ==========================================================

  createForm(): void {

    this.sourceForm = this.fb.group({

      sourceName: [
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
        1,
        [
          Validators.required,
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
  // CHECK EDIT MODE
  // ==========================================================

  checkEditMode(): void {

    this.route.paramMap.subscribe(params => {

      const id = params.get('id');

      if (id) {

        this.isEditMode = true;

        this.sourceId = Number(id);

        this.loadSource(this.sourceId);

      } else {

        this.isEditMode = false;

        this.sourceId = null;

      }

    });

  }


  // ==========================================================
  // LOAD SOURCE
  // ==========================================================

  loadSource(id: number): void {

    this.isLoading = true;

    this.errorMessage = '';

    this.leadSourceService.getLeadSourceById(id)
      .subscribe({

        next: (source: LeadSourceResponse) => {

          this.sourceForm.patchValue({

            sourceName: source.sourceName,

            description: source.description || '',

            displayOrder: source.displayOrder,

            status: source.status

          });

          this.isLoading = false;

        },

        error: (error) => {

          console.error(
            'Error loading lead source:',
            error
          );

          this.errorMessage =
            'Unable to load the lead source. Please try again.';

          this.isLoading = false;

        }

      });

  }


  // ==========================================================
  // SUBMIT
  // ==========================================================

  onSubmit(): void {

    this.successMessage = '';

    this.errorMessage = '';


    // --------------------------------------------------------
    // VALIDATION
    // --------------------------------------------------------

    if (this.sourceForm.invalid) {

      this.sourceForm.markAllAsTouched();

      this.errorMessage =
        'Please correct the highlighted fields before submitting.';

      return;

    }


    // --------------------------------------------------------
    // PREVENT DOUBLE SUBMIT
    // --------------------------------------------------------

    if (this.isSaving) {
      return;
    }


    this.isSaving = true;


    // --------------------------------------------------------
    // REQUEST
    // --------------------------------------------------------

    const request: LeadSourceRequest = {

      sourceName:
        this.sourceForm.value.sourceName?.trim(),

      description:
        this.sourceForm.value.description?.trim() || '',

      displayOrder:
        Number(this.sourceForm.value.displayOrder),

      status:
        this.sourceForm.value.status

    };


    // ========================================================
    // UPDATE
    // ========================================================

    if (this.isEditMode && this.sourceId !== null) {

      this.leadSourceService
        .updateLeadSource(
          this.sourceId,
          request
        )
        .subscribe({

          next: () => {

            this.isSaving = false;

            this.successMessage =
              'Lead source updated successfully.';

            setTimeout(() => {

              this.goBack();

            }, 900);

          },

          error: (error) => {

            console.error(
              'Error updating lead source:',
              error
            );

            this.isSaving = false;

            this.errorMessage =
              this.getErrorMessage(error);

          }

        });

      return;

    }


    // ========================================================
    // CREATE
    // ========================================================

    this.leadSourceService
      .addLeadSource(request)
      .subscribe({

        next: () => {

          this.isSaving = false;

          this.successMessage =
            'Lead source created successfully.';

          setTimeout(() => {

            this.goBack();

          }, 900);

        },

        error: (error) => {

          console.error(
            'Error creating lead source:',
            error
          );

          this.isSaving = false;

          this.errorMessage =
            this.getErrorMessage(error);

        }

      });

  }


  // ==========================================================
  // ERROR MESSAGE
  // ==========================================================

  private getErrorMessage(error: any): string {

    if (
      error?.error?.message
    ) {

      return error.error.message;

    }

    if (
      error?.error
    ) {

      return error.error;

    }

    if (
      error?.status === 409
    ) {

      return 'A lead source with this name already exists.';

    }

    if (
      error?.status === 400
    ) {

      return 'Please check the entered information.';

    }

    if (
      error?.status === 401 ||
      error?.status === 403
    ) {

      return 'You are not authorized to perform this action.';

    }

    return 'Something went wrong. Please try again.';

  }


  // ==========================================================
  // GO BACK
  // ==========================================================

  goBack(): void {

    this.router.navigate([
      '/admin/lead-configuration/source'
    ]);

  }

}