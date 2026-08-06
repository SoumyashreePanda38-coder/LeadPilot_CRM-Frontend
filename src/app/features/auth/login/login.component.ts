import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
export class LoginComponent {

  loginForm!: FormGroup;

  hidePassword: boolean = true;

  loading: boolean = false;

  submitted: boolean = false;

  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.loginForm = this.fb.group({

      username: ['', Validators.required],

      password: ['', Validators.required]

    });

  }

  get f() {
    return this.loginForm.controls;
  }

  login(): void {

    this.submitted = true;

    this.errorMessage = '';

    if (this.loginForm.invalid) {
      return;
    }

    this.loading = true;

    const request: LoginRequest = this.loginForm.value;

    this.authService.login(request).subscribe({

      next: (response: LoginResponse) => {

        const normalizedRole = this.getNormalizedRole(response);

        // Save JWT
        this.tokenService.saveToken(response.token);

        // Save User Details
        localStorage.setItem('user', JSON.stringify(response));
        localStorage.setItem('userRole', normalizedRole || 'ADMIN');

        this.loading = false;

        const targetRoute = normalizedRole === 'EXECUTIVE'
          ? '/executive/dashboard'
          : '/admin/dashboard';

        setTimeout(() => {
          this.router.navigateByUrl(targetRoute);
        }, 0);

      },

      error: (error) => {

        this.loading = false;

        if (error.error?.message) {
          this.errorMessage = error.error.message;
        } else {
          this.errorMessage = 'Invalid username or password.';
        }

      }

    });

  }

  togglePassword(): void {

    this.hidePassword = !this.hidePassword;

  }

  private getNormalizedRole(response: LoginResponse): string | null {

    const candidates = [
      response?.role,
      (response as any)?.userRole,
      (response as any)?.roles,
      (response as any)?.authorities,
      (response as any)?.roleName,
      (response as any)?.authority,
      (response as any)?.isAdmin,
      (response as any)?.admin
    ];

    for (const candidate of candidates) {
      if (typeof candidate === 'string') {
        const normalized = candidate.trim().toUpperCase().replace(/^ROLE_/, '');

        if (normalized === 'ADMIN' || normalized === 'EXECUTIVE') {
          return normalized;
        }
      }

      if (Array.isArray(candidate)) {
        for (const item of candidate) {
          if (typeof item === 'string') {
            const normalized = item.trim().toUpperCase().replace(/^ROLE_/, '');

            if (normalized === 'ADMIN' || normalized === 'EXECUTIVE') {
              return normalized;
            }
          }
        }
      }

      if (candidate && typeof candidate === 'object') {
        const nestedRole = (candidate as any).authority || (candidate as any).name || (candidate as any).role;

        if (typeof nestedRole === 'string') {
          const normalized = nestedRole.trim().toUpperCase().replace(/^ROLE_/, '');

          if (normalized === 'ADMIN' || normalized === 'EXECUTIVE') {
            return normalized;
          }
        }
      }
    }

    return null;

  }

}