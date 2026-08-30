import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { LeadSubCategoryRequest } from '../models/lead-subcategory-request';
import { LeadSubCategoryResponse } from '../models/lead-subcategory-response';
import { LeadCategoryStatus } from '../models/lead-category-status.enum';

@Injectable({
  providedIn: 'root'
})
export class LeadSubCategoryService {

  // ==========================================================
  // API URL
  // ==========================================================

  private readonly apiUrl =
    `${environment.apiUrl}/lead-subcategories`;


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(
    private http: HttpClient
  ) {}


  // ==========================================================
  // CREATE SUBCATEGORY
  // POST /api/lead-subcategories
  // ==========================================================

  createSubCategory(
    request: LeadSubCategoryRequest
  ): Observable<LeadSubCategoryResponse> {

    return this.http.post<LeadSubCategoryResponse>(
      this.apiUrl,
      request
    );

  }


  // ==========================================================
  // GET ALL SUBCATEGORIES
  // GET /api/lead-subcategories
  // ==========================================================

  getAllSubCategories(): Observable<LeadSubCategoryResponse[]> {

    return this.http.get<LeadSubCategoryResponse[]>(
      this.apiUrl
    );

  }


  // ==========================================================
  // GET SUBCATEGORY BY ID
  // GET /api/lead-subcategories/{subCategoryId}
  // ==========================================================

  getSubCategoryById(
    subCategoryId: number
  ): Observable<LeadSubCategoryResponse> {

    return this.http.get<LeadSubCategoryResponse>(
      `${this.apiUrl}/${subCategoryId}`
    );

  }


  // ==========================================================
  // GET SUBCATEGORIES BY CATEGORY
  // GET /api/lead-subcategories/category/{categoryId}
  // ==========================================================

  getSubCategoriesByCategory(
    categoryId: number
  ): Observable<LeadSubCategoryResponse[]> {

    return this.http.get<LeadSubCategoryResponse[]>(
      `${this.apiUrl}/category/${categoryId}`
    );

  }


  // ==========================================================
  // GET SUBCATEGORIES BY STATUS
  // GET /api/lead-subcategories/status/{status}
  // ==========================================================

  getSubCategoriesByStatus(
    status: LeadCategoryStatus
  ): Observable<LeadSubCategoryResponse[]> {

    return this.http.get<LeadSubCategoryResponse[]>(
      `${this.apiUrl}/status/${status}`
    );

  }


  // ==========================================================
  // UPDATE SUBCATEGORY
  // PUT /api/lead-subcategories/{subCategoryId}
  // ==========================================================

  updateSubCategory(
    subCategoryId: number,
    request: LeadSubCategoryRequest
  ): Observable<LeadSubCategoryResponse> {

    return this.http.put<LeadSubCategoryResponse>(
      `${this.apiUrl}/${subCategoryId}`,
      request
    );

  }


  // ==========================================================
  // UPDATE STATUS
  // PUT /api/lead-subcategories/{id}/status/{status}
  // ==========================================================

  updateStatus(
    subCategoryId: number,
    status: LeadCategoryStatus
  ): Observable<LeadSubCategoryResponse> {

    return this.http.put<LeadSubCategoryResponse>(
      `${this.apiUrl}/${subCategoryId}/status/${status}`,
      {}
    );

  }


  // ==========================================================
  // ACTIVATE SUBCATEGORY
  // PUT /api/lead-subcategories/{id}/activate
  // ==========================================================

  activateSubCategory(
    subCategoryId: number
  ): Observable<LeadSubCategoryResponse> {

    return this.http.put<LeadSubCategoryResponse>(
      `${this.apiUrl}/${subCategoryId}/activate`,
      {}
    );

  }


  // ==========================================================
  // DEACTIVATE SUBCATEGORY
  // PUT /api/lead-subcategories/{id}/deactivate
  // ==========================================================

  deactivateSubCategory(
    subCategoryId: number
  ): Observable<LeadSubCategoryResponse> {

    return this.http.put<LeadSubCategoryResponse>(
      `${this.apiUrl}/${subCategoryId}/deactivate`,
      {}
    );

  }


  // ==========================================================
  // DELETE SUBCATEGORY
  // DELETE /api/lead-subcategories/{subCategoryId}
  // ==========================================================

  deleteSubCategory(
    subCategoryId: number
  ): Observable<string> {

    return this.http.delete(
      `${this.apiUrl}/${subCategoryId}`,
      {
        responseType: 'text'
      }
    );

  }


  // ==========================================================
  // SEARCH SUBCATEGORIES
  // GET /api/lead-subcategories/search?keyword=
  // ==========================================================

  searchSubCategories(
    keyword: string
  ): Observable<LeadSubCategoryResponse[]> {

    const params = new HttpParams()
      .set('keyword', keyword);

    return this.http.get<LeadSubCategoryResponse[]>(
      `${this.apiUrl}/search`,
      { params }
    );

  }

}