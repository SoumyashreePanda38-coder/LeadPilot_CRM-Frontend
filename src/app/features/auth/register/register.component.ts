import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { AuthService } from '../../../core/services/auth.service';
import { WorkspaceRegistrationRequest } from '../../../core/models/workspace-registration-request';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  @Output() loginRequested = new EventEmitter<void>();

  registerForm: FormGroup;

  isSubmitting = false;

  showPassword = false;
  showConfirmPassword = false;

  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {

    this.registerForm = this.fb.group({

      organizationName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(150)
        ]
      ],

      fullName: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(100)
        ]
      ],

      username: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
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
          Validators.pattern(/^\d{10}$/)
        ]
      ],

      designation: [
        '',
        [
          Validators.maxLength(100)
        ]
      ],

      password: [
        '',
        [
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(100),
          Validators.pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,100}$/
          )
        ]
      ],

      confirmPassword: [
        '',
        [
          Validators.required
        ]
      ]

    });

  }


  /* =========================================================
     CONVENIENCE GETTER
  ========================================================= */

  get f() {
    return this.registerForm.controls;
  }


  /* =========================================================
     PASSWORD VISIBILITY
  ========================================================= */

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }


  /* =========================================================
     PHONE VALIDATION
  ========================================================= */

  isPhoneValid(): boolean {

    const phone =
      this.registerForm.get('phoneNumber')?.value || '';

    return /^\d{10}$/.test(phone);
  }


  getPhoneMessage(): string {

    const phone =
      this.registerForm.get('phoneNumber')?.value || '';

    if (!phone) {
      return '';
    }

    if (!/^\d+$/.test(phone)) {
      return 'Phone number must contain only digits.';
    }

    if (phone.length < 10) {
      return 'Phone number must contain 10 digits.';
    }

    if (phone.length > 10) {
      return 'Phone number cannot exceed 10 digits.';
    }

    return 'Phone number is valid.';
  }


  /* =========================================================
     ALLOW ONLY NUMBERS
  ========================================================= */

  allowOnlyNumbers(event: KeyboardEvent): void {

    const allowedKeys = [
      'Backspace',
      'Delete',
      'ArrowLeft',
      'ArrowRight',
      'Tab'
    ];

    if (allowedKeys.includes(event.key)) {
      return;
    }

    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }


  /* =========================================================
     PASSWORD VALIDATION
  ========================================================= */

  hasMinLength(): boolean {

    const password =
      this.registerForm.get('password')?.value || '';

    return password.length >= 8;
  }


  hasLowercase(): boolean {

    const password =
      this.registerForm.get('password')?.value || '';

    return /[a-z]/.test(password);
  }


  hasUppercase(): boolean {

    const password =
      this.registerForm.get('password')?.value || '';

    return /[A-Z]/.test(password);
  }


  hasDigit(): boolean {

    const password =
      this.registerForm.get('password')?.value || '';

    return /\d/.test(password);
  }


  /* =========================================================
     PASSWORD STRENGTH
  ========================================================= */

  getPasswordStrength(): string {

    const password =
      this.registerForm.get('password')?.value || '';

    if (!password) {
      return '';
    }

    let score = 0;

    if (password.length >= 8) {
      score++;
    }

    if (/[a-z]/.test(password)) {
      score++;
    }

    if (/[A-Z]/.test(password)) {
      score++;
    }

    if (/\d/.test(password)) {
      score++;
    }

    if (score <= 1) {
      return 'Weak';
    }

    if (score <= 3) {
      return 'Medium';
    }

    return 'Strong';
  }


  getPasswordStrengthClass(): string {

    const password =
      this.registerForm.get('password')?.value || '';

    if (!password) {
      return '';
    }

    let score = 0;

    if (password.length >= 8) {
      score++;
    }

    if (/[a-z]/.test(password)) {
      score++;
    }

    if (/[A-Z]/.test(password)) {
      score++;
    }

    if (/\d/.test(password)) {
      score++;
    }

    if (score <= 1) {
      return 'weak';
    }

    if (score <= 3) {
      return 'medium';
    }

    return 'strong';
  }


  /* =========================================================
     COMPLETE PASSWORD CHECK
  ========================================================= */

  isPasswordValid(): boolean {

    return (
      this.hasMinLength() &&
      this.hasLowercase() &&
      this.hasUppercase() &&
      this.hasDigit()
    );
  }


  /* =========================================================
     CONFIRM PASSWORD CHECK
  ========================================================= */

  passwordsMatch(): boolean {

    const password =
      this.registerForm.get('password')?.value || '';

    const confirmPassword =
      this.registerForm.get('confirmPassword')?.value || '';

    return (
      confirmPassword.length > 0 &&
      password === confirmPassword
    );
  }


  /* =========================================================
     REGISTER WORKSPACE
  ========================================================= */

  register(): void {

    this.successMessage = '';
    this.errorMessage = '';

    /* -----------------------------------------
       Basic form validation
    ----------------------------------------- */

    if (this.registerForm.invalid) {

      this.registerForm.markAllAsTouched();

      return;
    }


    /* -----------------------------------------
       Password validation
    ----------------------------------------- */

    const password =
      this.registerForm.get('password')?.value || '';

    const confirmPassword =
      this.registerForm.get('confirmPassword')?.value || '';


    if (!this.isPasswordValid()) {

      this.errorMessage =
        'Password must contain at least 8 characters, one uppercase letter, one lowercase letter, and one digit.';

      return;
    }


    /* -----------------------------------------
       Confirm password validation
    ----------------------------------------- */

    if (password !== confirmPassword) {

      this.registerForm
        .get('confirmPassword')
        ?.setErrors({ passwordMismatch: true });

      this.errorMessage =
        'Password and confirm password do not match.';

      return;
    }


    /* -----------------------------------------
       Phone validation
    ----------------------------------------- */

    const phoneNumber =
      this.registerForm.get('phoneNumber')?.value || '';

    if (!/^\d{10}$/.test(phoneNumber)) {

      this.errorMessage =
        'Phone number must contain exactly 10 digits.';

      this.registerForm
        .get('phoneNumber')
        ?.setErrors({ invalidPhone: true });

      return;
    }


    /* -----------------------------------------
       Start submission
    ----------------------------------------- */

    this.isSubmitting = true;


    /* -----------------------------------------
       Prepare request
    ----------------------------------------- */

    const request: WorkspaceRegistrationRequest = {

      organizationName:
        this.registerForm
          .get('organizationName')
          ?.value
          ?.trim(),

      fullName:
        this.registerForm
          .get('fullName')
          ?.value
          ?.trim(),

      username:
        this.registerForm
          .get('username')
          ?.value
          ?.trim(),

      email:
        this.registerForm
          .get('email')
          ?.value
          ?.trim(),

      phoneNumber:
        phoneNumber.trim(),

      designation:
        this.registerForm
          .get('designation')
          ?.value
          ?.trim() || '',

      password: password,

      confirmPassword: confirmPassword
    };


    /* -----------------------------------------
       API call
    ----------------------------------------- */

    this.authService
      .registerWorkspace(request)
      .subscribe({

        next: (response) => {

          this.isSubmitting = false;

          this.successMessage =
            response.message ||
            'Workspace registered successfully.';

          /*
           * Clear the form after successful registration.
           */
          this.registerForm.reset();

          this.showPassword = false;
          this.showConfirmPassword = false;

          /*
           * Wait briefly so the user can see the
           * success message, then return to Login.
           */
          setTimeout(() => {

            this.loginRequested.emit();

          }, 1500);

        },


        error: (error) => {

          this.isSubmitting = false;

          console.error(
            'Workspace registration failed:',
            error
          );


          if (error?.error?.message) {

            this.errorMessage =
              error.error.message;

          }

          else if (error?.error?.error) {

            this.errorMessage =
              error.error.error;

          }

          else {

            this.errorMessage =
              'Unable to register workspace. Please try again.';

          }

        }

      });

  }


  /* =========================================================
     BACK TO LOGIN
  ========================================================= */

  backToLogin(): void {

    this.loginRequested.emit();

  }

}