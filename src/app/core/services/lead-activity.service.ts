import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { LeadActivityRequest } from '../models/lead-activity-request';
import { LeadActivityResponse } from '../models/lead-activity-response';
import { LeadActivityType } from '../models/lead-activity-type.enum';

@Injectable({
  providedIn: 'root'
})
export class LeadActivityService {

  // ==========================================================
  // API URL
  // ==========================================================

  private readonly apiUrl =
    `${environment.apiUrl}/lead-activities`;


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(
    private http: HttpClient
  ) {}


  // ==========================================================
  // CREATE ACTIVITY
  // POST /api/lead-activities
  // ==========================================================

  createActivity(
    request: LeadActivityRequest
  ): Observable<LeadActivityResponse> {

    return this.http.post<LeadActivityResponse>(
      this.apiUrl,
      request
    );
  }


  // ==========================================================
  // GET ACTIVITY BY ID
  // GET /api/lead-activities/{activityId}
  // ==========================================================

  getActivityById(
    activityId: number
  ): Observable<LeadActivityResponse> {

    return this.http.get<LeadActivityResponse>(
      `${this.apiUrl}/${activityId}`
    );
  }


  // ==========================================================
  // GET ALL ACTIVITIES
  // GET /api/lead-activities
  // ==========================================================

  getAllActivities(): Observable<LeadActivityResponse[]> {

    return this.http.get<LeadActivityResponse[]>(
      this.apiUrl
    );
  }


  // ==========================================================
  // GET ACTIVITIES BY LEAD
  // LATEST FIRST
  //
  // GET /api/lead-activities/lead/{leadId}
  // ==========================================================

  getActivitiesByLead(
    leadId: number
  ): Observable<LeadActivityResponse[]> {

    return this.http.get<LeadActivityResponse[]>(
      `${this.apiUrl}/lead/${leadId}`
    );
  }


  // ==========================================================
  // GET ACTIVITIES BY LEAD
  // OLDEST FIRST
  //
  // GET /api/lead-activities/lead/{leadId}/oldest
  // ==========================================================

  getActivitiesByLeadOldestFirst(
    leadId: number
  ): Observable<LeadActivityResponse[]> {

    return this.http.get<LeadActivityResponse[]>(
      `${this.apiUrl}/lead/${leadId}/oldest`
    );
  }


  // ==========================================================
  // GET ACTIVITIES BY TYPE
  //
  // GET /api/lead-activities/type/{activityType}
  // ==========================================================

  getActivitiesByType(
    activityType: LeadActivityType
  ): Observable<LeadActivityResponse[]> {

    return this.http.get<LeadActivityResponse[]>(
      `${this.apiUrl}/type/${activityType}`
    );
  }


  // ==========================================================
  // GET ACTIVITIES BY USER
  //
  // GET /api/lead-activities/user/{userId}
  // ==========================================================

  getActivitiesByUser(
    userId: number
  ): Observable<LeadActivityResponse[]> {

    return this.http.get<LeadActivityResponse[]>(
      `${this.apiUrl}/user/${userId}`
    );
  }


  // ==========================================================
  // GET ACTIVITIES BY LEAD + TYPE
  //
  // GET /api/lead-activities/lead/{leadId}/type/{activityType}
  // ==========================================================

  getActivitiesByLeadAndType(
    leadId: number,
    activityType: LeadActivityType
  ): Observable<LeadActivityResponse[]> {

    return this.http.get<LeadActivityResponse[]>(
      `${this.apiUrl}/lead/${leadId}/type/${activityType}`
    );
  }


  // ==========================================================
  // GET ACTIVITIES BY LEAD + USER
  //
  // GET /api/lead-activities/lead/{leadId}/user/{userId}
  // ==========================================================

  getActivitiesByLeadAndUser(
    leadId: number,
    userId: number
  ): Observable<LeadActivityResponse[]> {

    return this.http.get<LeadActivityResponse[]>(
      `${this.apiUrl}/lead/${leadId}/user/${userId}`
    );
  }


  // ==========================================================
  // GET ACTIVITIES BY LEAD + TYPE
  // LATEST FIRST
  //
  // GET
  // /api/lead-activities/lead/{leadId}/type/{activityType}/latest
  // ==========================================================

  getActivitiesByLeadAndTypeLatestFirst(
    leadId: number,
    activityType: LeadActivityType
  ): Observable<LeadActivityResponse[]> {

    return this.http.get<LeadActivityResponse[]>(
      `${this.apiUrl}/lead/${leadId}/type/${activityType}/latest`
    );
  }


  // ==========================================================
  // GET USER ACTIVITIES
  // LATEST FIRST
  //
  // GET /api/lead-activities/user/{userId}/latest
  // ==========================================================

  getActivitiesByUserLatestFirst(
    userId: number
  ): Observable<LeadActivityResponse[]> {

    return this.http.get<LeadActivityResponse[]>(
      `${this.apiUrl}/user/${userId}/latest`
    );
  }

}