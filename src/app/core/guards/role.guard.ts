import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router
} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(
    private router: Router
  ) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    const expectedRole = route.data['role'];

    const userRole = localStorage.getItem('userRole');

    if (userRole === expectedRole) {
      return true;
    }

    this.router.navigate(['/auth/login']);

    return false;

  }

}