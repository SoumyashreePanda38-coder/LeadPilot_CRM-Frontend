import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { CustomerLeadRequest } from '../../core/models/customer-lead-request';
import { CustomerLeadResponse } from '../../core/models/customer-lead-response';

import { LeadStatus } from '../../core/models/lead-status.enum';
import { LeadPriority } from '../../core/models/lead-priority.enum';

@Injectable({
  providedIn: 'root'
})
export class CustomerLeadService {

  // ==========================================================
  // API URL
  // ==========================================================

  private readonly apiUrl =
    `${environment.apiUrl}/customer-leads`;


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(
    private http: HttpClient
  ) {}


  // ==========================================================
  // CREATE LEAD
  // POST /api/customer-leads
  // ==========================================================

  createLead(
    request: CustomerLeadRequest
  ): Observable<CustomerLeadResponse> {

    return this.http.post<CustomerLeadResponse>(
      this.apiUrl,
      request
    );
  }


  // ==========================================================
  // GET ALL LEADS
  // GET /api/customer-leads
  // ==========================================================

  getAllLeads(): Observable<CustomerLeadResponse[]> {

    return this.http.get<CustomerLeadResponse[]>(
      this.apiUrl
    );
  }


  // ==========================================================
  // GET LEAD BY ID
  // GET /api/customer-leads/{leadId}
  // ==========================================================

  getLeadById(
    leadId: number
  ): Observable<CustomerLeadResponse> {

    return this.http.get<CustomerLeadResponse>(
      `${this.apiUrl}/${leadId}`
    );
  }


  // ==========================================================
  // UPDATE LEAD
  // PUT /api/customer-leads/{leadId}
  // ==========================================================

  updateLead(
    leadId: number,
    request: CustomerLeadRequest
  ): Observable<CustomerLeadResponse> {

    return this.http.put<CustomerLeadResponse>(
      `${this.apiUrl}/${leadId}`,
      request
    );
  }


  // ==========================================================
  // DELETE LEAD
  // DELETE /api/customer-leads/{leadId}
  // ==========================================================

  deleteLead(
    leadId: number
  ): Observable<string> {

    return this.http.delete(
      `${this.apiUrl}/${leadId}`,
      {
        responseType: 'text'
      }
    );
  }


  // ==========================================================
  // GET LEADS BY CATEGORY
  // GET /api/customer-leads/category/{categoryId}
  // ==========================================================

  getLeadsByCategory(
    categoryId: number
  ): Observable<CustomerLeadResponse[]> {

    return this.http.get<CustomerLeadResponse[]>(
      `${this.apiUrl}/category/${categoryId}`
    );
  }


  // ==========================================================
  // GET LEADS BY SUBCATEGORY
  // GET /api/customer-leads/subcategory/{subCategoryId}
  // ==========================================================

  getLeadsBySubCategory(
    subCategoryId: number
  ): Observable<CustomerLeadResponse[]> {

    return this.http.get<CustomerLeadResponse[]>(
      `${this.apiUrl}/subcategory/${subCategoryId}`
    );
  }


  // ==========================================================
  // GET LEADS BY SOURCE
  // GET /api/customer-leads/source/{sourceId}
  // ==========================================================

  getLeadsBySource(
    sourceId: number
  ): Observable<CustomerLeadResponse[]> {

    return this.http.get<CustomerLeadResponse[]>(
      `${this.apiUrl}/source/${sourceId}`
    );
  }


  // ==========================================================
  // GET LEADS BY STATUS
  // GET /api/customer-leads/status/{status}
  // ==========================================================

  getLeadsByStatus(
    status: LeadStatus
  ): Observable<CustomerLeadResponse[]> {

    return this.http.get<CustomerLeadResponse[]>(
      `${this.apiUrl}/status/${status}`
    );
  }


  // ==========================================================
  // GET LEADS BY PRIORITY
  // GET /api/customer-leads/priority/{priority}
  // ==========================================================

  getLeadsByPriority(
    priority: LeadPriority
  ): Observable<CustomerLeadResponse[]> {

    return this.http.get<CustomerLeadResponse[]>(
      `${this.apiUrl}/priority/${priority}`
    );
  }


  // ==========================================================
  // GET LEADS BY ASSIGNED USER
  // GET /api/customer-leads/assigned-user/{userId}
  // ==========================================================

  getLeadsByAssignedUser(
    userId: number
  ): Observable<CustomerLeadResponse[]> {

    return this.http.get<CustomerLeadResponse[]>(
      `${this.apiUrl}/assigned-user/${userId}`
    );
  }


  // ==========================================================
  // FILTER BY STATUS + PRIORITY
  // GET /api/customer-leads/filter/status-priority
  // ==========================================================

  getLeadsByStatusAndPriority(
    status: LeadStatus,
    priority: LeadPriority
  ): Observable<CustomerLeadResponse[]> {

    const params = new HttpParams()
      .set('status', status)
      .set('priority', priority);

    return this.http.get<CustomerLeadResponse[]>(
      `${this.apiUrl}/filter/status-priority`,
      { params }
    );
  }


  // ==========================================================
  // FILTER BY CATEGORY + SUBCATEGORY
  // GET /api/customer-leads/filter/category-subcategory
  // ==========================================================

  getLeadsByCategoryAndSubCategory(
    categoryId: number,
    subCategoryId: number
  ): Observable<CustomerLeadResponse[]> {

    const params = new HttpParams()
      .set('categoryId', categoryId)
      .set('subCategoryId', subCategoryId);

    return this.http.get<CustomerLeadResponse[]>(
      `${this.apiUrl}/filter/category-subcategory`,
      { params }
    );
  }


  // ==========================================================
  // FILTER BY ASSIGNED USER + STATUS
  // GET /api/customer-leads/filter/assigned-user-status
  // ==========================================================

  getLeadsByAssignedUserAndStatus(
    userId: number,
    status: LeadStatus
  ): Observable<CustomerLeadResponse[]> {

    const params = new HttpParams()
      .set('userId', userId)
      .set('status', status);

    return this.http.get<CustomerLeadResponse[]>(
      `${this.apiUrl}/filter/assigned-user-status`,
      { params }
    );
  }


  // ==========================================================
  // FILTER BY ASSIGNED USER + PRIORITY
  // GET /api/customer-leads/filter/assigned-user-priority
  // ==========================================================

  getLeadsByAssignedUserAndPriority(
    userId: number,
    priority: LeadPriority
  ): Observable<CustomerLeadResponse[]> {

    const params = new HttpParams()
      .set('userId', userId)
      .set('priority', priority);

    return this.http.get<CustomerLeadResponse[]>(
      `${this.apiUrl}/filter/assigned-user-priority`,
      { params }
    );
  }


  // ==========================================================
  // ASSIGN LEAD
  // PUT /api/customer-leads/{leadId}/assign/{userId}
  // ==========================================================

  assignLead(
    leadId: number,
    userId: number
  ): Observable<CustomerLeadResponse> {

    return this.http.put<CustomerLeadResponse>(
      `${this.apiUrl}/${leadId}/assign/${userId}`,
      {}
    );
  }


  // ==========================================================
  // UNASSIGN LEAD
  // PUT /api/customer-leads/{leadId}/unassign
  // ==========================================================

  unassignLead(
    leadId: number
  ): Observable<CustomerLeadResponse> {

    return this.http.put<CustomerLeadResponse>(
      `${this.apiUrl}/${leadId}/unassign`,
      {}
    );
  }

}