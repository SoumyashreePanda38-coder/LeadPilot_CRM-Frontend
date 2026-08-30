import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { LeadCategoryRequest } from '../models/lead-category-request';
import { LeadCategoryResponse } from '../models/lead-category-response';
import { LeadCategoryStatus } from '../models/lead-category-status.enum';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeadCategoryService {

  private readonly API_URL = environment.apiUrl + '/lead-categories';

  constructor(private http: HttpClient) {}

  // ==========================================================
  // CREATE LEAD CATEGORY
  // POST /api/lead-categories
  // ==========================================================

  addCategory(
    request: LeadCategoryRequest
  ): Observable<LeadCategoryResponse> {

    return this.http.post<LeadCategoryResponse>(
      this.API_URL,
      request
    );
  }

  // ==========================================================
  // GET ALL LEAD CATEGORIES
  // GET /api/lead-categories
  // ==========================================================

  getAllCategories(): Observable<LeadCategoryResponse[]> {

    return this.http.get<LeadCategoryResponse[]>(
      this.API_URL
    );
  }

  // ==========================================================
  // GET LEAD CATEGORY BY ID
  // GET /api/lead-categories/{categoryId}
  // ==========================================================

  getCategoryById(
    categoryId: number
  ): Observable<LeadCategoryResponse> {

    return this.http.get<LeadCategoryResponse>(
      `${this.API_URL}/${categoryId}`
    );
  }

  // ==========================================================
  // UPDATE LEAD CATEGORY
  // PUT /api/lead-categories/{categoryId}
  // ==========================================================

  updateCategory(
    categoryId: number,
    request: LeadCategoryRequest
  ): Observable<LeadCategoryResponse> {

    return this.http.put<LeadCategoryResponse>(
      `${this.API_URL}/${categoryId}`,
      request
    );
  }

  // ==========================================================
  // UPDATE CATEGORY STATUS
  // PUT /api/lead-categories/{categoryId}/status/{status}
  // ==========================================================

  updateCategoryStatus(
    categoryId: number,
    status: LeadCategoryStatus
  ): Observable<LeadCategoryResponse> {

    return this.http.put<LeadCategoryResponse>(
      `${this.API_URL}/${categoryId}/status/${status}`,
      {}
    );
  }

  // ==========================================================
  // ACTIVATE CATEGORY
  // PUT /api/lead-categories/{categoryId}/activate
  // ==========================================================

  activateCategory(
    categoryId: number
  ): Observable<LeadCategoryResponse> {

    return this.http.put<LeadCategoryResponse>(
      `${this.API_URL}/${categoryId}/activate`,
      {}
    );
  }

  // ==========================================================
  // DEACTIVATE CATEGORY
  // PUT /api/lead-categories/{categoryId}/deactivate
  // ==========================================================

  deactivateCategory(
    categoryId: number
  ): Observable<LeadCategoryResponse> {

    return this.http.put<LeadCategoryResponse>(
      `${this.API_URL}/${categoryId}/deactivate`,
      {}
    );
  }

  // ==========================================================
  // SEARCH CATEGORIES
  // GET /api/lead-categories/search?name=...
  // ==========================================================

  searchCategories(
    name: string
  ): Observable<LeadCategoryResponse[]> {

    const params = new HttpParams()
      .set('name', name);

    return this.http.get<LeadCategoryResponse[]>(
      `${this.API_URL}/search`,
      { params }
    );
  }

  // ==========================================================
  // GET CATEGORIES BY STATUS
  // GET /api/lead-categories/status/{status}
  // ==========================================================

  getCategoriesByStatus(
    status: LeadCategoryStatus
  ): Observable<LeadCategoryResponse[]> {

    return this.http.get<LeadCategoryResponse[]>(
      `${this.API_URL}/status/${status}`
    );
  }

  // ==========================================================
  // GET ACTIVE CATEGORIES
  // GET /api/lead-categories/active
  // ==========================================================

  getActiveCategories(): Observable<LeadCategoryResponse[]> {

    return this.http.get<LeadCategoryResponse[]>(
      `${this.API_URL}/active`
    );
  }
}