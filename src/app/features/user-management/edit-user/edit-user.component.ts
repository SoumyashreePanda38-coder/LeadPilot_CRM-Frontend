import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import {
  ActivatedRoute,
  Router
} from '@angular/router';

import { UserManagementService } from '../../../core/services/user-management.service';
import { UserManagementRequest } from '../../../core/models/user-management-request';
import { UserManagementResponse } from '../../../core/models/user-management-response';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {

  // ==========================================================
  // FORM
  // ==========================================================

  executiveForm!: FormGroup;

  // ==========================================================
  // USER
  // ==========================================================

  executiveId!: number;
  executive!: UserManagementResponse;

  // ==========================================================
  // UI STATE
  // ==========================================================

  isLoading = true;
  isSubmitting = false;

  showPassword = false;
  showConfirmPassword = false;

  successMessage = '';
  errorMessage = '';

  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private userManagementService: UserManagementService,
    private router: Router
  ) {}

  // ==========================================================
  // INITIALIZE
  // ==========================================================

  ngOnInit(): void {

    this.initializeForm();

    const idParam = this.route.snapshot.paramMap.get('id');

    if (!idParam) {

      this.errorMessage =
        'Unable to identify the executive.';

      this.isLoading = false;

      return;
    }

    this.executiveId = Number(idParam);

    if (
      Number.isNaN(this.executiveId) ||
      this.executiveId <= 0
    ) {

      this.errorMessage =
        'Invalid executive ID.';

      this.isLoading = false;

      return;
    }

    this.loadExecutive();
  }

  // ==========================================================
  // FORM INITIALIZATION
  // ==========================================================

  private initializeForm(): void {

    this.executiveForm = this.fb.group({

      employeeId: [
        {
          value: '',
          disabled: true
        },
        [
          Validators.required,
          Validators.maxLength(20)
        ]
      ],

      fullName: [
        '',
        [
          Validators.required,
          Validators.maxLength(100)
        ]
      ],

      username: [
        '',
        [
          Validators.required,
          Validators.maxLength(50)
        ]
      ],

      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.maxLength(100)
        ]
      ],

      phoneNumber: [
        '',
        [
          Validators.required,
          Validators.maxLength(15),
          Validators.pattern(/^[0-9+\-\s()]+$/)
        ]
      ],

      password: [
        '',
        [
          Validators.minLength(6),
          Validators.maxLength(100)
        ]
      ],

      confirmPassword: [
        '',
        [
          Validators.minLength(6),
          Validators.maxLength(100)
        ]
      ],

      designation: [
        '',
        [
          Validators.maxLength(100)
        ]
      ],

      department: [
        '',
        [
          Validators.maxLength(100)
        ]
      ]

    });
  }

  // ==========================================================
  // FORM GETTER
  // ==========================================================

  get f() {
    return this.executiveForm.controls;
  }

  // ==========================================================
  // LOAD EXECUTIVE
  // ==========================================================

  private loadExecutive(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.userManagementService
      .getExecutiveById(this.executiveId)
      .subscribe({

        next: (response: UserManagementResponse) => {

          this.executive = response;

          this.executiveForm.patchValue({

            employeeId:
              response.employeeId,

            fullName:
              response.fullName,

            username:
              response.username,

            email:
              response.email,

            phoneNumber:
              response.phoneNumber,

            designation:
              response.designation || '',

            department:
              response.department || '',

            password: '',

            confirmPassword: ''

          });

          this.isLoading = false;
        },

        error: (error) => {

          console.error(
            'Error loading executive:',
            error
          );

          this.isLoading = false;

          if (error.status === 401) {

            this.errorMessage =
              'Your session has expired. Please login again.';

          } else if (error.status === 403) {

            this.errorMessage =
              'You do not have permission to view this executive.';

          } else if (error.status === 404) {

            this.errorMessage =
              'Executive not found.';

          } else {

            this.errorMessage =
              'Unable to load executive details. Please try again.';
          }
        }

      });
  }

  // ==========================================================
  // PASSWORD MATCH VALIDATION
  // ==========================================================

  passwordsMatch(): boolean {

    const password =
      this.executiveForm.get('password')?.value;

    const confirmPassword =
      this.executiveForm.get('confirmPassword')?.value;

    // Both empty means password is not being changed.
    if (!password && !confirmPassword) {
      return true;
    }

    return password === confirmPassword;
  }

  // ==========================================================
  // SUBMIT
  // ==========================================================

  onSubmit(): void {

    this.successMessage = '';
    this.errorMessage = '';

    // --------------------------------------------------------
    // Validate form
    // --------------------------------------------------------

    if (this.executiveForm.invalid) {

      this.executiveForm.markAllAsTouched();

      this.errorMessage =
        'Please correct the highlighted fields.';

      return;
    }

    // --------------------------------------------------------
    // Validate password
    // --------------------------------------------------------

    if (!this.passwordsMatch()) {

      this.errorMessage =
        'Password and confirm password do not match.';

      this.executiveForm
        .get('confirmPassword')
        ?.markAsTouched();

      return;
    }

    // --------------------------------------------------------
    // Get logged-in ADMIN ID
    // --------------------------------------------------------

    const storedUserId =
      localStorage.getItem('userId');

    const adminId =
      storedUserId
        ? Number(storedUserId)
        : null;

    if (
      !adminId ||
      Number.isNaN(adminId)
    ) {

      this.errorMessage =
        'Unable to identify the logged-in administrator. Please login again.';

      return;
    }

    // --------------------------------------------------------
    // Get form values
    // --------------------------------------------------------

    const formValue =
      this.executiveForm.getRawValue();

    // --------------------------------------------------------
    // Prepare request
    // --------------------------------------------------------

    const request: UserManagementRequest = {

      employeeId:
        formValue.employeeId?.trim(),

      fullName:
        formValue.fullName?.trim(),

      username:
        formValue.username?.trim(),

      email:
        formValue.email?.trim(),

      phoneNumber:
        formValue.phoneNumber?.trim(),

      password:
        formValue.password || '',

      designation:
        formValue.designation?.trim(),

      department:
        formValue.department?.trim()
    };

    // ========================================================
    // API CALL
    // ========================================================

    this.isSubmitting = true;

    this.userManagementService
      .updateExecutive(
        this.executiveId,
        request,
        adminId
      )
      .subscribe({

        next: () => {

          this.isSubmitting = false;

          this.successMessage =
            'Executive details updated successfully.';

          // Navigate after showing success.
          setTimeout(() => {

            this.router.navigate([
              '/admin/users'
            ]);

          }, 1000);
        },

        error: (error) => {

          this.isSubmitting = false;

          console.error(
            'Error updating executive:',
            error
          );

          if (error.status === 400) {

            this.errorMessage =
              'Please check the entered information and try again.';

          } else if (error.status === 401) {

            this.errorMessage =
              'Your session has expired. Please login again.';

          } else if (error.status === 403) {

            this.errorMessage =
              'You do not have permission to update this executive.';

          } else if (error.status === 404) {

            this.errorMessage =
              'Executive not found.';

          } else if (error.status === 409) {

            this.errorMessage =
              'The employee ID, username, or email is already in use.';

          } else {

            this.errorMessage =
              'Unable to update the executive. Please try again.';
          }
        }

      });
  }

  // ==========================================================
  // BACK
  // ==========================================================

  onBack(): void {

    this.router.navigate([
      '/admin/users'
    ]);
  }

  // ==========================================================
  // CANCEL
  // ==========================================================

  onCancel(): void {

    this.router.navigate([
      '/admin/users'
    ]);
  }

  // ==========================================================
  // PASSWORD VISIBILITY
  // ==========================================================

  togglePassword(): void {

    this.showPassword =
      !this.showPassword;
  }

  // ==========================================================
  // CONFIRM PASSWORD VISIBILITY
  // ==========================================================

  toggleConfirmPassword(): void {

    this.showConfirmPassword =
      !this.showConfirmPassword;
  }

}