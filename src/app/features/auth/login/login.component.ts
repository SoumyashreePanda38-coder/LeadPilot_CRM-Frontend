import { Component, OnInit, HostListener } from '@angular/core';import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  loginForm!: FormGroup;

  hidePassword = true;

  loading = false;

  submitted = false;

  errorMessage = '';

  /**
 * Mouse Shine Effect
 */
mouseX = '50%';
mouseY = '50%';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
  ) { }

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

  console.log('========== LOGIN SUCCESS ==========');
  console.log(response);

  // Save JWT
  this.tokenService.saveToken(response.token);

  // Save logged-in user
  localStorage.setItem('user', JSON.stringify(response));

  // Determine role
  const role = this.getUserRole(response);

  localStorage.setItem('userRole', role);

  this.loading = false;

  console.log('Detected Role:', role);

  // Navigate according to role
  if (role === 'EXECUTIVE') {

    this.router.navigate(['/executive/dashboard/executive'])
      .then(success => console.log('Executive Navigation:', success));

  } else {

    this.router.navigate(['/admin/dashboard'])
      .then(success => console.log('Admin Navigation:', success));

  }

},

      error: (error) => {

        this.loading = false;

        console.error(error);

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
  /**
 * Mouse Tracking Animation
 */

  /**
   * Extract role from backend response
   */
  private getUserRole(response: any): string {

    if (!response) {
      return 'ADMIN';
    }

    if (response.role) {
      return response.role.toUpperCase().replace('ROLE_', '');
    }

    if (response.userRole) {
      return response.userRole.toUpperCase().replace('ROLE_', '');
    }

    if (response.authority) {
      return response.authority.toUpperCase().replace('ROLE_', '');
    }

    if (response.roleName) {
      return response.roleName.toUpperCase().replace('ROLE_', '');
    }

    if (response.roles && response.roles.length > 0) {

      if (typeof response.roles[0] === 'string') {

        return response.roles[0].toUpperCase().replace('ROLE_', '');

      }

      if (response.roles[0].name) {

        return response.roles[0].name.toUpperCase().replace('ROLE_', '');

      }

      if (response.roles[0].authority) {

        return response.roles[0].authority.toUpperCase().replace('ROLE_', '');

      }

    }

    return 'ADMIN';

  }

}