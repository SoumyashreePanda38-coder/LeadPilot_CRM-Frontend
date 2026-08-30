
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserManagementRequest } from '../models/user-management-request';
import { UserManagementResponse } from '../models/user-management-response';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {

  // ==========================================================
  // API BASE URL
  // ==========================================================

  private readonly apiUrl =
  `${environment.apiUrl}/admin/users`;
  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(private http: HttpClient) {}

  // ==========================================================
  // CREATE EXECUTIVE
  // POST /api/admin/users?adminId=1
  // ==========================================================

  createExecutive(
    request: UserManagementRequest,
    adminId: number
  ): Observable<UserManagementResponse> {

    const params = new HttpParams()
      .set('adminId', adminId.toString());

    return this.http.post<UserManagementResponse>(
      this.apiUrl,
      request,
      { params }
    );
  }

  // ==========================================================
  // GET ALL EXECUTIVES
  // GET /api/admin/users
  // ==========================================================

  getAllExecutives(): Observable<UserManagementResponse[]> {

    return this.http.get<UserManagementResponse[]>(
      this.apiUrl
    );
  }

  // ==========================================================
  // GET EXECUTIVE BY ID
  // GET /api/admin/users/{id}
  // ==========================================================

  getExecutiveById(
    id: number
  ): Observable<UserManagementResponse> {

    return this.http.get<UserManagementResponse>(
      `${this.apiUrl}/${id}`
    );
  }

  // ==========================================================
  // UPDATE EXECUTIVE
  // PUT /api/admin/users/{id}?adminId=1
  // ==========================================================

  updateExecutive(
    id: number,
    request: UserManagementRequest,
    adminId: number
  ): Observable<UserManagementResponse> {

    const params = new HttpParams()
      .set('adminId', adminId.toString());

    return this.http.put<UserManagementResponse>(
      `${this.apiUrl}/${id}`,
      request,
      { params }
    );
  }

  // ==========================================================
  // ACTIVATE EXECUTIVE
  // PUT /api/admin/users/{id}/activate?adminId=1
  // ==========================================================

  activateExecutive(
    id: number,
    adminId: number
  ): Observable<UserManagementResponse> {

    const params = new HttpParams()
      .set('adminId', adminId.toString());

    return this.http.put<UserManagementResponse>(
      `${this.apiUrl}/${id}/activate`,
      null,
      { params }
    );
  }

  // ==========================================================
  // DEACTIVATE EXECUTIVE
  // PUT /api/admin/users/{id}/deactivate?adminId=1
  // ==========================================================

  deactivateExecutive(
    id: number,
    adminId: number
  ): Observable<UserManagementResponse> {

    const params = new HttpParams()
      .set('adminId', adminId.toString());

    return this.http.put<UserManagementResponse>(
      `${this.apiUrl}/${id}/deactivate`,
      null,
      { params }
    );
  }
}

