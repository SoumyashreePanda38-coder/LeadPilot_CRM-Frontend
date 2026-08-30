import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { AdminDashboardResponse } from '../models/admin-dashboard-response';
import { ExecutiveDashboardResponse } from '../models/executive-dashboard-response';


/**
 * ==========================================================
 * SERVICE : DashboardService
 *
 * Description :
 * Handles API communication for:
 *
 * - Admin Dashboard
 * - Executive Dashboard
 *
 * Backend Controller:
 *
 * /api/dashboard
 *
 * ==========================================================
 */

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  // ==========================================================
  // API URL
  // ==========================================================

  private readonly apiUrl =
    `${environment.apiUrl}/dashboard`;


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(
    private http: HttpClient
  ) {}


  // ==========================================================
  // ADMIN DASHBOARD
  // ==========================================================

  /**
   * Retrieves the complete Admin Dashboard.
   *
   * Backend:
   *
   * GET /api/dashboard/admin/{userId}
   *
   * @param userId ID of the logged-in Admin
   */

  getAdminDashboard(
    userId: number
  ): Observable<AdminDashboardResponse> {

    return this.http.get<AdminDashboardResponse>(
      `${this.apiUrl}/admin/${userId}`
    );

  }


  // ==========================================================
  // EXECUTIVE DASHBOARD
  // ==========================================================

  /**
   * Retrieves the complete Executive Dashboard.
   *
   * Backend:
   *
   * GET /api/dashboard/executive/{userId}
   *
   * @param userId ID of the logged-in Executive
   */

  getExecutiveDashboard(
    userId: number
  ): Observable<ExecutiveDashboardResponse> {

    return this.http.get<ExecutiveDashboardResponse>(
      `${this.apiUrl}/executive/${userId}`
    );

  }

}