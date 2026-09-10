import {
  Component,
  EventEmitter,
  OnInit,
  Output
} from '@angular/core';

import {
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';

import { Router } from '@angular/router';

import { AuthService } from '../../../core/services/auth.service';
import { TokenService } from '../../../core/services/token.service';

import { LoginRequest } from '../../../core/models/login-request';
import { LoginResponse } from '../../../core/models/login-response';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  // =========================================================
  // OUTPUT - OPEN REGISTER
  // =========================================================

  @Output() registerRequested = new EventEmitter<void>();


  // =========================================================
  // FORM
  // =========================================================

  loginForm!: FormGroup;


  // =========================================================
  // UI STATE
  // =========================================================

  hidePassword: boolean = true;

  loading: boolean = false;

  submitted: boolean = false;

  errorMessage: string = '';

  rememberMe: boolean = false;


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {}


  // =========================================================
  // INITIALIZATION
  // =========================================================

  ngOnInit(): void {

    this.loginForm = this.fb.group({

      username: [
        '',
        Validators.required
      ],

      password: [
        '',
        Validators.required
      ]

    });


    // ---------------------------------------------------------
    // Load Remembered Username
    // ---------------------------------------------------------

    const rememberedUsername =
      localStorage.getItem('rememberedUsername');

    if (rememberedUsername) {

      this.loginForm.patchValue({
        username: rememberedUsername
      });

      this.rememberMe = true;

    }

  }


  // =========================================================
  // FORM CONTROLS
  // =========================================================

  get f() {

    return this.loginForm.controls;

  }


  // =========================================================
  // OPEN REGISTER
  // =========================================================

  openRegister(): void {

    this.registerRequested.emit();

  }


  // =========================================================
  // LOGIN
  // =========================================================

  login(): void {

    this.submitted = true;

    this.errorMessage = '';


    // ---------------------------------------------------------
    // Validate Form
    // ---------------------------------------------------------

    if (this.loginForm.invalid) {

      this.loginForm.markAllAsTouched();

      return;

    }


    this.loading = true;


    // ---------------------------------------------------------
    // Prepare Request
    // ---------------------------------------------------------

    const request: LoginRequest = {

      username:
        this.loginForm.value.username.trim(),

      password:
        this.loginForm.value.password

    };


    // ---------------------------------------------------------
    // Call Authentication API
    // ---------------------------------------------------------

    this.authService.login(request).subscribe({

      next: (response: LoginResponse) => {


        console.log(
          '========== LOGIN SUCCESS =========='
        );

        console.log(response);


        // -----------------------------------------------------
        // Save JWT
        // -----------------------------------------------------

        this.tokenService.saveToken(
          response.token
        );


        // -----------------------------------------------------
        // Save Logged-in User
        // -----------------------------------------------------

        localStorage.setItem(
          'user',
          JSON.stringify(response)
        );


        // -----------------------------------------------------
        // Save User ID
        // -----------------------------------------------------

        if (
          response.id !== undefined &&
          response.id !== null
        ) {

          localStorage.setItem(
            'userId',
            response.id.toString()
          );

        }


        // -----------------------------------------------------
        // Detect User Role
        // -----------------------------------------------------

        const role =
          this.getUserRole(response);


        localStorage.setItem(
          'userRole',
          role
        );


        // -----------------------------------------------------
        // Remember Me
        // -----------------------------------------------------

        if (this.rememberMe) {

          localStorage.setItem(
            'rememberedUsername',
            request.username
          );

        } else {

          localStorage.removeItem(
            'rememberedUsername'
          );

        }


        this.loading = false;


        console.log(
          'Detected Role:',
          role
        );


        // -----------------------------------------------------
        // Navigate According to Role
        // -----------------------------------------------------

        if (role === 'EXECUTIVE') {

          this.router.navigate([
            '/executive/dashboard/executive'
          ]).then(success => {

            console.log(
              'Executive Navigation:',
              success
            );

          });

        } else {

          this.router.navigate([
            '/admin/dashboard'
          ]).then(success => {

            console.log(
              'Admin Navigation:',
              success
            );

          });

        }

      },


      // =======================================================
      // LOGIN ERROR
      // =======================================================

      error: (error) => {

        this.loading = false;

        console.error(
          'Login Error:',
          error
        );


        if (error?.error?.message) {

          this.errorMessage =
            error.error.message;

        } else {

          this.errorMessage =
            'Invalid username or password.';

        }

      }

    });

  }


  // =========================================================
  // PASSWORD VISIBILITY
  // =========================================================

  togglePassword(): void {

    this.hidePassword =
      !this.hidePassword;

  }


  // =========================================================
  // ROLE DETECTION
  // =========================================================

  private getUserRole(
    response: any
  ): string {


    if (!response) {

      return 'ADMIN';

    }


    // ---------------------------------------------------------
    // role
    // ---------------------------------------------------------

    if (response.role) {

      return response.role
        .toUpperCase()
        .replace('ROLE_', '');

    }


    // ---------------------------------------------------------
    // userRole
    // ---------------------------------------------------------

    if (response.userRole) {

      return response.userRole
        .toUpperCase()
        .replace('ROLE_', '');

    }


    // ---------------------------------------------------------
    // authority
    // ---------------------------------------------------------

    if (response.authority) {

      return response.authority
        .toUpperCase()
        .replace('ROLE_', '');

    }


    // ---------------------------------------------------------
    // roleName
    // ---------------------------------------------------------

    if (response.roleName) {

      return response.roleName
        .toUpperCase()
        .replace('ROLE_', '');

    }


    // ---------------------------------------------------------
    // roles[]
    // ---------------------------------------------------------

    if (
      response.roles &&
      response.roles.length > 0
    ) {


      if (
        typeof response.roles[0] === 'string'
      ) {

        return response.roles[0]
          .toUpperCase()
          .replace('ROLE_', '');

      }


      if (
        response.roles[0].name
      ) {

        return response.roles[0].name
          .toUpperCase()
          .replace('ROLE_', '');

      }


      if (
        response.roles[0].authority
      ) {

        return response.roles[0].authority
          .toUpperCase()
          .replace('ROLE_', '');

      }

    }


    // ---------------------------------------------------------
    // Default
    // ---------------------------------------------------------

    return 'ADMIN';

  }

}