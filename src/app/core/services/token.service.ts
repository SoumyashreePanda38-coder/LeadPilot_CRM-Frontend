import { Injectable } from '@angular/core';

/**
 * ==========================================================
 * Service : TokenService
 *
 * Description :
 * Handles JWT Token storage inside Local Storage.
 *
 * Responsibilities:
 * 1. Save JWT Token
 * 2. Retrieve JWT Token
 * 3. Remove JWT Token
 * 4. Check Login Status
 * ==========================================================
 */

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  // Local Storage Key
  private readonly TOKEN_KEY = 'leadpilot_token';

  constructor() { }

  /**
   * Save JWT Token
   */
  saveToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  /**
   * Get JWT Token
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  /**
   * Remove JWT Token
   */
  removeToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Check whether user is logged in
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Logout User
   */
  logout(): void {
  localStorage.clear();
}

}