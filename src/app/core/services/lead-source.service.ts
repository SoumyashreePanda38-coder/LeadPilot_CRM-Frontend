import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { LeadSourceRequest } from '../models/lead-source-request';
import { LeadSourceResponse } from '../models/lead-source-response';
import { LeadCategoryStatus } from '../models/lead-category-status.enum';


@Injectable({
  providedIn: 'root'
})
export class LeadSourceService {

  // ==========================================================
  // API URL
  // ==========================================================

  private readonly apiUrl =
    `${environment.apiUrl}/lead-sources`;


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(
    private http: HttpClient
  ) {}


  // ==========================================================
  // CREATE LEAD SOURCE
  // ==========================================================

  addLeadSource(
    request: LeadSourceRequest
  ): Observable<LeadSourceResponse> {

    return this.http.post<LeadSourceResponse>(
      this.apiUrl,
      request
    );
  }


  // ==========================================================
  // GET ALL LEAD SOURCES
  // ==========================================================

  getAllLeadSources(): Observable<LeadSourceResponse[]> {

    return this.http.get<LeadSourceResponse[]>(
      this.apiUrl
    );
  }


  // ==========================================================
  // GET LEAD SOURCE BY ID
  // ==========================================================

  getLeadSourceById(
    sourceId: number
  ): Observable<LeadSourceResponse> {

    return this.http.get<LeadSourceResponse>(
      `${this.apiUrl}/${sourceId}`
    );
  }


  // ==========================================================
  // GET LEAD SOURCES BY STATUS
  // ==========================================================

  getLeadSourcesByStatus(
    status: LeadCategoryStatus
  ): Observable<LeadSourceResponse[]> {

    return this.http.get<LeadSourceResponse[]>(
      `${this.apiUrl}/status/${status}`
    );
  }


  // ==========================================================
  // UPDATE LEAD SOURCE
  // ==========================================================

  updateLeadSource(
    sourceId: number,
    request: LeadSourceRequest
  ): Observable<LeadSourceResponse> {

    return this.http.put<LeadSourceResponse>(
      `${this.apiUrl}/${sourceId}`,
      request
    );
  }


  // ==========================================================
  // UPDATE STATUS
  // ==========================================================

  updateStatus(
    sourceId: number,
    status: LeadCategoryStatus
  ): Observable<LeadSourceResponse> {

    return this.http.put<LeadSourceResponse>(
      `${this.apiUrl}/${sourceId}/status/${status}`,
      {}
    );
  }


  // ==========================================================
  // ACTIVATE LEAD SOURCE
  // ==========================================================

  activateLeadSource(
    sourceId: number
  ): Observable<LeadSourceResponse> {

    return this.http.put<LeadSourceResponse>(
      `${this.apiUrl}/${sourceId}/activate`,
      {}
    );
  }


  // ==========================================================
  // DEACTIVATE LEAD SOURCE
  // ==========================================================

  deactivateLeadSource(
    sourceId: number
  ): Observable<LeadSourceResponse> {

    return this.http.put<LeadSourceResponse>(
      `${this.apiUrl}/${sourceId}/deactivate`,
      {}
    );
  }


  // ==========================================================
  // DELETE LEAD SOURCE
  // ==========================================================

  deleteLeadSource(
    sourceId: number
  ): Observable<string> {

    return this.http.delete(
      `${this.apiUrl}/${sourceId}`,
      {
        responseType: 'text'
      }
    );
  }


  // ==========================================================
  // SEARCH LEAD SOURCES
  // ==========================================================

  searchLeadSources(
    keyword: string
  ): Observable<LeadSourceResponse[]> {

    const params = new HttpParams()
      .set('keyword', keyword);

    return this.http.get<LeadSourceResponse[]>(
      `${this.apiUrl}/search`,
      { params }
    );
  }

}