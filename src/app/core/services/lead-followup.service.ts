import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { FollowUpRequest } from '../models/follow-up-request';
import { FollowUpResponse } from '../models/follow-up-response';
import { FollowUpStatus } from '../models/follow-up-status.enum';
import { FollowUpType } from '../models/follow-up-type.enum';

@Injectable({
  providedIn: 'root'
})
export class LeadFollowUpService {

  // ==========================================================
  // API URL
  // ==========================================================

  private readonly apiUrl =
    `${environment.apiUrl}/follow-ups`;

  constructor(
    private http: HttpClient
  ) { }

  // ==========================================================
  // CREATE FOLLOW-UP
  // ==========================================================

  createFollowUp(
    request: FollowUpRequest
  ): Observable<FollowUpResponse> {

    return this.http.post<FollowUpResponse>(
      this.apiUrl,
      request
    );
  }

  // ==========================================================
  // GET ALL FOLLOW-UPS
  // ==========================================================

  getAllFollowUps(): Observable<FollowUpResponse[]> {
    return this.http.get<FollowUpResponse[]>(this.apiUrl);
  }

  // ==========================================================
  // GET FOLLOW-UP BY ID
  // ==========================================================

  getFollowUpById(
    followUpId: number
  ): Observable<FollowUpResponse> {

    return this.http.get<FollowUpResponse>(
      `${this.apiUrl}/${followUpId}`
    );
  }

  // ==========================================================
  // UPDATE FOLLOW-UP
  // ==========================================================

  updateFollowUp(
    followUpId: number,
    request: FollowUpRequest
  ): Observable<FollowUpResponse> {

    return this.http.put<FollowUpResponse>(
      `${this.apiUrl}/${followUpId}`,
      request
    );
  }

  // ==========================================================
  // DELETE FOLLOW-UP
  // ==========================================================

  deleteFollowUp(
    followUpId: number
  ): Observable<string> {

    return this.http.delete(
      `${this.apiUrl}/${followUpId}`,
      {
        responseType: 'text'
      }
    );
  }

  // ==========================================================
  // GET FOLLOW-UPS BY LEAD
  // ==========================================================

  getFollowUpsByLead(
    leadId: number
  ): Observable<FollowUpResponse[]> {

    return this.http.get<FollowUpResponse[]>(
      `${this.apiUrl}/lead/${leadId}`
    );
  }

  getFollowUpsByLeadAndDateRange(
    leadId: number,
    start: string,
    end: string
  ): Observable<FollowUpResponse[]> {

    const params = new HttpParams()
      .set('start', start)
      .set('end', end);

    return this.http.get<FollowUpResponse[]>(
      `${this.apiUrl}/lead/${leadId}/date-range`,
      { params }
    );
  }

  getFollowUpsByLeadAndStatus(
    leadId: number,
    status: FollowUpStatus
  ): Observable<FollowUpResponse[]> {

    return this.http.get<FollowUpResponse[]>(
      `${this.apiUrl}/lead/${leadId}/status/${status}`
    );
  }

  getFollowUpsByLeadAndType(
    leadId: number,
    followUpType: FollowUpType
  ): Observable<FollowUpResponse[]> {

    return this.http.get<FollowUpResponse[]>(
      `${this.apiUrl}/lead/${leadId}/type/${followUpType}`
    );
  }

  // ==========================================================
  // GET FOLLOW-UPS BY USER
  // ==========================================================

  getFollowUpsByUser(
    userId: number
  ): Observable<FollowUpResponse[]> {

    return this.http.get<FollowUpResponse[]>(
      `${this.apiUrl}/user/${userId}`
    );
  }

  getFollowUpsByUserAndDateRange(
    userId: number,
    start: string,
    end: string
  ): Observable<FollowUpResponse[]> {

    const params = new HttpParams()
      .set('start', start)
      .set('end', end);

    return this.http.get<FollowUpResponse[]>(
      `${this.apiUrl}/user/${userId}/date-range`,
      { params }
    );
  }

  getFollowUpsByUserAndStatus(
    userId: number,
    status: FollowUpStatus
  ): Observable<FollowUpResponse[]> {

    return this.http.get<FollowUpResponse[]>(
      `${this.apiUrl}/user/${userId}/status/${status}`
    );
  }

  getFollowUpsByUserAndType(
    userId: number,
    followUpType: FollowUpType
  ): Observable<FollowUpResponse[]> {

    return this.http.get<FollowUpResponse[]>(
      `${this.apiUrl}/user/${userId}/type/${followUpType}`
    );
  }

  // ==========================================================
  // GET FOLLOW-UPS BY STATUS
  // ==========================================================

  getFollowUpsByStatus(
    status: FollowUpStatus
  ): Observable<FollowUpResponse[]> {

    return this.http.get<FollowUpResponse[]>(
      `${this.apiUrl}/status/${status}`
    );
  }

  // ==========================================================
  // UPDATE STATUS / COMPLETE / CANCEL
  // ==========================================================

  updateFollowUpStatus(
    followUpId: number,
    status: FollowUpStatus
  ): Observable<FollowUpResponse> {

    return this.http.put<FollowUpResponse>(
      `${this.apiUrl}/${followUpId}/status/${status}`,
      null
    );
  }

  completeFollowUp(
    followUpId: number,
    outcome?: string
  ): Observable<FollowUpResponse> {

    let params = new HttpParams();

    if (outcome) {
      params = params.set('outcome', outcome);
    }

    return this.http.put<FollowUpResponse>(
      `${this.apiUrl}/${followUpId}/complete`,
      null,
      { params }
    );
  }

  cancelFollowUp(
    followUpId: number
  ): Observable<FollowUpResponse> {

    return this.http.put<FollowUpResponse>(
      `${this.apiUrl}/${followUpId}/cancel`,
      null
    );
  }

  // ==========================================================
  // GET FOLLOW-UPS BY TYPE
  // ==========================================================

  getFollowUpsByType(
    followUpType: FollowUpType
  ): Observable<FollowUpResponse[]> {

    return this.http.get<FollowUpResponse[]>(
      `${this.apiUrl}/type/${followUpType}`
    );
  }

  getFollowUpsByTypeAndStatus(
    followUpType: FollowUpType,
    status: FollowUpStatus
  ): Observable<FollowUpResponse[]> {

    return this.http.get<FollowUpResponse[]>(
      `${this.apiUrl}/type/${followUpType}/status/${status}`
    );
  }

  // ==========================================================
  // GET FOLLOW-UPS BETWEEN DATES
  // ==========================================================

  getFollowUpsBetween(
    start: string,
    end: string
  ): Observable<FollowUpResponse[]> {

    const params = new HttpParams()
      .set('start', start)
      .set('end', end);

    return this.http.get<FollowUpResponse[]>(
      `${this.apiUrl}/date-range`,
      { params }
    );
  }

  // ==========================================================
  // TODAY / UPCOMING / OVERDUE
  // ==========================================================

  getTodaysFollowUps(): Observable<FollowUpResponse[]> {
    return this.http.get<FollowUpResponse[]>(`${this.apiUrl}/today`);
  }

  getTodaysFollowUpsByUser(
    userId: number
  ): Observable<FollowUpResponse[]> {

    return this.http.get<FollowUpResponse[]>(
      `${this.apiUrl}/today/user/${userId}`
    );
  }

  getUpcomingFollowUps(): Observable<FollowUpResponse[]> {
    return this.http.get<FollowUpResponse[]>(`${this.apiUrl}/upcoming`);
  }

  getUpcomingFollowUpsByUser(
    userId: number
  ): Observable<FollowUpResponse[]> {

    return this.http.get<FollowUpResponse[]>(
      `${this.apiUrl}/upcoming/user/${userId}`
    );
  }

  getOverdueFollowUps(): Observable<FollowUpResponse[]> {
    return this.http.get<FollowUpResponse[]>(`${this.apiUrl}/overdue`);
  }

  getOverdueFollowUpsByUser(
    userId: number
  ): Observable<FollowUpResponse[]> {

    return this.http.get<FollowUpResponse[]>(
      `${this.apiUrl}/overdue/user/${userId}`
    );
  }

  // ==========================================================
  // COUNT ENDPOINTS
  // ==========================================================

  countFollowUpsByStatus(
    status: FollowUpStatus
  ): Observable<number> {

    return this.http.get<number>(
      `${this.apiUrl}/count/status/${status}`
    );
  }

  countFollowUpsByUserAndStatus(
    userId: number,
    status: FollowUpStatus
  ): Observable<number> {

    return this.http.get<number>(
      `${this.apiUrl}/count/user/${userId}/status/${status}`
    );
  }

  countFollowUpsByLead(
    leadId: number
  ): Observable<number> {

    return this.http.get<number>(
      `${this.apiUrl}/count/lead/${leadId}`
    );
  }

  countFollowUpsByUser(
    userId: number
  ): Observable<number> {

    return this.http.get<number>(
      `${this.apiUrl}/count/user/${userId}`
    );
  }

  // ==========================================================
  // SORTED / RECENT / COMPLETED
  // ==========================================================

  getFollowUpsByScheduledDate(): Observable<FollowUpResponse[]> {
    return this.http.get<FollowUpResponse[]>(`${this.apiUrl}/scheduled`);
  }

  getRecentlyCreatedFollowUps(): Observable<FollowUpResponse[]> {
    return this.http.get<FollowUpResponse[]>(`${this.apiUrl}/recent`);
  }

  getCompletedFollowUpsByLead(
    leadId: number
  ): Observable<FollowUpResponse[]> {

    return this.http.get<FollowUpResponse[]>(
      `${this.apiUrl}/lead/${leadId}/completed`
    );
  }

  getCompletedFollowUpsByUser(
    userId: number
  ): Observable<FollowUpResponse[]> {

    return this.http.get<FollowUpResponse[]>(
      `${this.apiUrl}/user/${userId}/completed`
    );
  }

  getFollowUpsByStatusAndDateRange(
    status: FollowUpStatus,
    start: string,
    end: string
  ): Observable<FollowUpResponse[]> {

    const params = new HttpParams()
      .set('start', start)
      .set('end', end);

    return this.http.get<FollowUpResponse[]>(
      `${this.apiUrl}/status/${status}/date-range`,
      { params }
    );
  }

  getFollowUpsByUserStatusAndDateRange(
    userId: number,
    status: FollowUpStatus,
    start: string,
    end: string
  ): Observable<FollowUpResponse[]> {

    const params = new HttpParams()
      .set('start', start)
      .set('end', end);

    return this.http.get<FollowUpResponse[]>(
      `${this.apiUrl}/user/${userId}/status/${status}/date-range`,
      { params }
    );
  }
}
