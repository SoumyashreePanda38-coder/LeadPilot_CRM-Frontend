import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from 'src/environments/environment';

import { LoginRequest } from '../models/login-request';
import { LoginResponse } from '../models/login-response';
import { ChangePasswordRequest } from '../models/change-password-request';
import { UserProfileResponse } from '../models/user-profile-response';

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

  /**
   * ==========================================================
   * Login
   * ==========================================================
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

  /**
   * ==========================================================
   * Logout
   * ==========================================================
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

  /**
   * ==========================================================
   * Change Password
   * ==========================================================
   */
  changePassword(request: ChangePasswordRequest): Observable<string> {

    return this.http.put(
      `${this.apiUrl}/change-password`,
      request,
      {
        responseType: 'text'
      }
    );

  }

  /**
   * ==========================================================
   * Get Logged-in User Profile
   * ==========================================================
   */
  getProfile(): Observable<UserProfileResponse> {

    return this.http.get<UserProfileResponse>(
      `${this.apiUrl}/profile`
    );

  }

  /**
   * ==========================================================
   * Check Login Status
   * ==========================================================
   */
  isLoggedIn(): boolean {

    return this.tokenService.isLoggedIn();

  }

  /**
   * ==========================================================
   * Get JWT Token
   * ==========================================================
   */
  getToken(): string | null {

    return this.tokenService.getToken();

  }

}