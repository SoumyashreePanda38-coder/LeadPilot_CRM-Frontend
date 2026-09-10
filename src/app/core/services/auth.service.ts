import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from 'src/environments/environment';

import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';
import { ChangePasswordRequest } from '../models/change-password-request';
import { UserProfileResponse } from '../models/user-profile-response';

import { WorkspaceRegistrationRequest } from '../models/workspace-registration-request';
import { WorkspaceRegistrationResponse } from '../models/workspace-registration-response';

import { TokenService } from './token.service';

/**
 * ==========================================================
 * Service : AuthService
 *
 * Description :
 * Handles Authentication APIs.
 *
 * Backend APIs:
 *
 * POST /api/auth/register
 * POST /api/auth/login
 * POST /api/auth/logout
 * PUT  /api/auth/change-password
 * GET  /api/auth/profile
 * ==========================================================
 */

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  /**
   * Backend Base URL
   */
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService
  ) { }


  // ==========================================================
  // Workspace Registration
  // ==========================================================

  /**
   * Registers a new LeadPilot CRM workspace.
   *
   * The backend automatically:
   *
   * - Creates the Organization
   * - Creates the first Admin
   * - Assigns ADMIN role
   * - Activates the Admin
   * - Generates employee ID
   * - Encrypts the password
   *
   * Backend:
   * POST /api/auth/register
   */
  registerWorkspace(
    request: WorkspaceRegistrationRequest
  ): Observable<WorkspaceRegistrationResponse> {

    return this.http.post<WorkspaceRegistrationResponse>(
      `${this.apiUrl}/register`,
      request
    );

  }


  // ==========================================================
  // Login
  // ==========================================================

  /**
   * Authenticates user using username and password.
   *
   * Backend:
   * POST /api/auth/login
   */
  login(request: LoginRequest): Observable<LoginResponse> {

    return this.http.post<LoginResponse>(
      `${this.apiUrl}/login`,
      request
    ).pipe(

      tap((response: LoginResponse) => {

        if (response.token) {
          this.tokenService.saveToken(response.token);
        }

      })

    );

  }


  // ==========================================================
  // Logout
  // ==========================================================

  /**
   * Logs out the currently authenticated user.
   *
   * Backend:
   * POST /api/auth/logout
   */
  logout(): Observable<string> {

    return this.http.post(
      `${this.apiUrl}/logout`,
      {},
      {
        responseType: 'text'
      }
    ).pipe(

      tap(() => {

        this.tokenService.logout();

      })

    );

  }


  // ==========================================================
  // Change Password
  // ==========================================================

  /**
   * Changes password of currently logged-in user.
   *
   * Backend:
   * PUT /api/auth/change-password
   */
  changePassword(
    request: ChangePasswordRequest
  ): Observable<string> {

    return this.http.put(
      `${this.apiUrl}/change-password`,
      request,
      {
        responseType: 'text'
      }
    );

  }


  // ==========================================================
  // Get Logged-in User Profile
  // ==========================================================

  /**
   * Retrieves currently logged-in user's profile.
   *
   * Backend:
   * GET /api/auth/profile
   */
  getProfile(): Observable<UserProfileResponse> {

    return this.http.get<UserProfileResponse>(
      `${this.apiUrl}/profile`
    );

  }


  // ==========================================================
  // Check Login Status
  // ==========================================================

  isLoggedIn(): boolean {

    return this.tokenService.isLoggedIn();

  }


  // ==========================================================
  // Get JWT Token
  // ==========================================================

  getToken(): string | null {

    return this.tokenService.getToken();

  }

}