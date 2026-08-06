import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

import { TokenService } from '../services/token.service';

/**
 * ==========================================================
 * Interceptor : ErrorInterceptor
 *
 * Description :
 * Handles all HTTP errors globally.
 *
 * Responsibilities:
 * 1. Handle 401 Unauthorized
 * 2. Handle 403 Forbidden
 * 3. Handle 404 Not Found
 * 4. Handle 500 Internal Server Error
 * 5. Display Toastr Notifications
 * ==========================================================
 */

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private router: Router,
    private toastr: ToastrService,
    private tokenService: TokenService
  ) { }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {

    return next.handle(request).pipe(

      catchError((error: HttpErrorResponse) => {

        switch (error.status) {

          // =============================================
          // 400 Bad Request
          // =============================================
          case 400:

            this.toastr.warning(
              error.error?.message || 'Invalid request.',
              'Warning'
            );

            break;

          // =============================================
          // 401 Unauthorized
          // =============================================
          case 401:

            this.tokenService.logout();

            this.toastr.error(
              'Session expired. Please login again.',
              'Unauthorized'
            );

            this.router.navigate(['/auth/login']);

            break;

          // =============================================
          // 403 Forbidden
          // =============================================
          case 403:

            this.toastr.error(
              'You are not authorized to access this page.',
              'Access Denied'
            );

            this.router.navigate(['/access-denied']);

            break;

          // =============================================
          // 404 Not Found
          // =============================================
          case 404:

            this.toastr.warning(
              'Requested resource not found.',
              'Not Found'
            );

            break;

          // =============================================
          // 500 Internal Server Error
          // =============================================
          case 500:

            this.toastr.error(
              error.error?.message || 'Internal Server Error.',
              'Server Error'
            );

            break;

          // =============================================
          // Network Error
          // =============================================
          case 0:

            this.toastr.error(
              'Unable to connect to the server.',
              'Connection Error'
            );

            break;

          // =============================================
          // Other Errors
          // =============================================
          default:

            this.toastr.error(
              error.error?.message || 'Something went wrong.',
              'Error'
            );

        }

        return throwError(() => error);

      })

    );

  }

}