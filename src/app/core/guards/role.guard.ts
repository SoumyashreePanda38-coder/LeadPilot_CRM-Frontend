import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router
} from '@angular/router';

import { TokenService } from '../services/token.service';

/**
 * ==========================================================
 * Role Guard
 *
 * Allows access only if the logged-in user's
 * role matches the route role.
 * ==========================================================
 */

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private tokenService: TokenService,
    private router: Router
  ) { }

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const expectedRole = route.data['role'];

    const token = this.tokenService.getToken();

    if (!token) {

      this.router.navigate(['/auth/login']);

      return false;

    }

    const payload = JSON.parse(atob(token.split('.')[1]));

    const role = payload.role;

    if (role === expectedRole) {

      return true;

    }

    this.router.navigate(['/access-denied']);

    return false;

  }

}