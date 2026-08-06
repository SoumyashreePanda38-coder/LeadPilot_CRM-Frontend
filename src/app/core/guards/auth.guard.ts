import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router
} from '@angular/router';

import { TokenService } from '../services/token.service';

/**
 * ==========================================================
 * Auth Guard
 *
 * Prevents unauthenticated users from
 * accessing protected routes.
 * ==========================================================
 */

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) { }

  canActivate(): boolean {

    if (this.tokenService.isLoggedIn()) {

      return true;

    }

    this.router.navigate(['/auth/login']);

    return false;

  }

}