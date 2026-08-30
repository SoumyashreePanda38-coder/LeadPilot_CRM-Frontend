import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { UserManagementService } from '../../../core/services/user-management.service';
import { UserManagementRequest } from '../../../core/models/user-management-request';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.css']
})
export class AddUserComponent implements OnInit {

  // ==========================================================
  // FORM
  // ==========================================================

  executiveForm!: FormGroup;

  // ==========================================================
  // UI STATE
  // ==========================================================

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
    private userManagementService: UserManagementService,
    private router: Router
  ) {}

  // ==========================================================
  // INITIALIZE
  // ==========================================================

  ngOnInit(): void {
    this.initializeForm();
  }

  // ==========================================================
  // FORM INITIALIZATION
  // ==========================================================

  private initializeForm(): void {

    this.executiveForm = this.fb.group({

      employeeId: [
        '',
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
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(100)
        ]
      ],

      confirmPassword: [
        '',
        [
          Validators.required
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
  // PASSWORD MATCH VALIDATION
  // ==========================================================

  passwordsMatch(): boolean {

    const password =
      this.executiveForm.get('password')?.value;

    const confirmPassword =
      this.executiveForm.get('confirmPassword')?.value;

    return password === confirmPassword;
  }

  // ==========================================================
  // SUBMIT
  // ==========================================================

  onSubmit(): void {

    this.successMessage = '';
    this.errorMessage = '';

    if (this.executiveForm.invalid) {

      this.executiveForm.markAllAsTouched();

      this.errorMessage =
        'Please correct the highlighted fields.';

      return;
    }

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
      storedUserId ? Number(storedUserId) : null;

    if (!adminId || Number.isNaN(adminId)) {

      this.errorMessage =
        'Unable to identify the logged-in administrator. Please login again.';

      return;
    }

    // --------------------------------------------------------
    // Prepare request
    // --------------------------------------------------------

    const request: UserManagementRequest = {

      employeeId:
        this.executiveForm.get('employeeId')?.value.trim(),

      fullName:
        this.executiveForm.get('fullName')?.value.trim(),

      username:
        this.executiveForm.get('username')?.value.trim(),

      email:
        this.executiveForm.get('email')?.value.trim(),

      phoneNumber:
        this.executiveForm.get('phoneNumber')?.value.trim(),

      password:
        this.executiveForm.get('password')?.value,

      designation:
        this.executiveForm.get('designation')?.value.trim(),

      department:
        this.executiveForm.get('department')?.value.trim()
    };

    // ========================================================
    // API CALL
    // ========================================================

    this.isSubmitting = true;

    this.userManagementService
      .createExecutive(request, adminId)
      .subscribe({

        next: () => {

          this.isSubmitting = false;

          this.successMessage =
            'Executive account created successfully.';

          // Give the user a moment to see success message.
          setTimeout(() => {
            this.router.navigate([
              '/admin/users'
            ]);
          }, 1000);
        },

        error: (error) => {

          this.isSubmitting = false;

          console.error(
            'Error creating executive:',
            error
          );

          if (error.status === 409) {

            this.errorMessage =
              'An executive with the same employee ID, username, or email already exists.';

          } else if (error.status === 400) {

            this.errorMessage =
              'Please check the entered information and try again.';

          } else if (error.status === 401) {

            this.errorMessage =
              'Your session has expired. Please login again.';

          } else if (error.status === 403) {

            this.errorMessage =
              'You do not have permission to create an executive.';

          } else {

            this.errorMessage =
              'Unable to create the executive. Please try again.';
          }
        }
      });
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
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword =
      !this.showConfirmPassword;
  }
}