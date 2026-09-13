import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

import { ReminderRequest } from '../models/reminder-request';
import { ReminderResponse } from '../models/reminder-response';


/**
 * ==========================================================
 * SERVICE : ReminderService
 * ==========================================================
 *
 * Handles all API communication related to CRM reminders.
 *
 * Backend Base URL:
 * /api/reminders
 *
 * Responsibilities:
 *
 * - Create reminder
 * - Get all reminders
 * - Get reminder by ID
 * - Update reminder
 * - Delete reminder
 * - Get reminders by user
 * - Get pending reminders
 * - Get unread reminders
 * - Get unread reminder count
 * - Get completed reminders
 * - Get dismissed reminders
 * - Get reminders by lead
 * - Get reminders by follow-up
 * - Mark as read
 * - Complete reminder
 * - Dismiss reminder
 * - Restore reminder
 * - Get upcoming reminders
 * - Get due reminders
 * - Notification tracking
 * - Search reminders
 * - Check reminder existence
 *
 * ==========================================================
 */

@Injectable({
  providedIn: 'root'
})
export class ReminderService {

  // ==========================================================
  // BASE URL
  // ==========================================================

  private readonly apiUrl =
    `${environment.apiUrl}/reminders`;


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(
    private http: HttpClient
  ) {}


  // ==========================================================
  // CREATE REMINDER
  // ==========================================================

  createReminder(
    request: ReminderRequest
  ): Observable<ReminderResponse> {

    return this.http.post<ReminderResponse>(
      this.apiUrl,
      request
    );

  }


  // ==========================================================
  // GET ALL REMINDERS
  // ==========================================================

  getAllReminders(): Observable<ReminderResponse[]> {

    return this.http.get<ReminderResponse[]>(
      this.apiUrl
    );

  }


  // ==========================================================
  // GET REMINDER BY ID
  // ==========================================================

  getReminderById(
    reminderId: number
  ): Observable<ReminderResponse> {

    return this.http.get<ReminderResponse>(
      `${this.apiUrl}/${reminderId}`
    );

  }


  // ==========================================================
  // UPDATE REMINDER
  // ==========================================================

  updateReminder(
    reminderId: number,
    request: ReminderRequest
  ): Observable<ReminderResponse> {

    return this.http.put<ReminderResponse>(
      `${this.apiUrl}/${reminderId}`,
      request
    );

  }


  // ==========================================================
  // DELETE REMINDER
  // ==========================================================

  deleteReminder(
    reminderId: number
  ): Observable<void> {

    return this.http.delete<void>(
      `${this.apiUrl}/${reminderId}`
    );

  }


  // ==========================================================
  // GET REMINDERS BY USER
  // ==========================================================

  getRemindersByUser(
    userId: number
  ): Observable<ReminderResponse[]> {

    return this.http.get<ReminderResponse[]>(
      `${this.apiUrl}/user/${userId}`
    );

  }


  // ==========================================================
  // GET PENDING REMINDERS BY USER
  // ==========================================================

  getPendingRemindersByUser(
    userId: number
  ): Observable<ReminderResponse[]> {

    return this.http.get<ReminderResponse[]>(
      `${this.apiUrl}/user/${userId}/pending`
    );

  }


  // ==========================================================
  // GET UNREAD REMINDERS BY USER
  // ==========================================================

  getUnreadRemindersByUser(
    userId: number
  ): Observable<ReminderResponse[]> {

    return this.http.get<ReminderResponse[]>(
      `${this.apiUrl}/user/${userId}/unread`
    );

  }


  // ==========================================================
  // ⭐ GET UNREAD REMINDER COUNT BY USER
  // ==========================================================
  //
  // Used by the Admin Navbar notification badge.
  //
  // Backend:
  // GET /api/reminders/user/{userId}/unread/count
  //
  // Example:
  // GET /api/reminders/user/1/unread/count
  //
  // Response:
  // 3
  //
  // ==========================================================

  getUnreadReminderCountByUser(
    userId: number
  ): Observable<number> {

    return this.http.get<number>(
      `${this.apiUrl}/user/${userId}/unread/count`
    );

  }


  // ==========================================================
  // GET COMPLETED REMINDERS BY USER
  // ==========================================================

  getCompletedRemindersByUser(
    userId: number
  ): Observable<ReminderResponse[]> {

    return this.http.get<ReminderResponse[]>(
      `${this.apiUrl}/user/${userId}/completed`
    );

  }


  // ==========================================================
  // GET DISMISSED REMINDERS BY USER
  // ==========================================================

  getDismissedRemindersByUser(
    userId: number
  ): Observable<ReminderResponse[]> {

    return this.http.get<ReminderResponse[]>(
      `${this.apiUrl}/user/${userId}/dismissed`
    );

  }


  // ==========================================================
  // GET UPCOMING REMINDERS BY USER
  // ==========================================================

  getUpcomingRemindersByUser(
    userId: number,
    dateTime?: string
  ): Observable<ReminderResponse[]> {

    let params = new HttpParams();

    if (dateTime) {
      params = params.set(
        'dateTime',
        dateTime
      );
    }

    return this.http.get<ReminderResponse[]>(
      `${this.apiUrl}/user/${userId}/upcoming`,
      { params }
    );

  }


  // ==========================================================
  // GET DUE REMINDERS BY USER
  // ==========================================================

  getDueRemindersByUser(
    userId: number,
    dateTime?: string
  ): Observable<ReminderResponse[]> {

    let params = new HttpParams();

    if (dateTime) {
      params = params.set(
        'dateTime',
        dateTime
      );
    }

    return this.http.get<ReminderResponse[]>(
      `${this.apiUrl}/user/${userId}/due`,
      { params }
    );

  }


  // ==========================================================
  // GET REMINDERS BY LEAD
  // ==========================================================

  getRemindersByLead(
    leadId: number
  ): Observable<ReminderResponse[]> {

    return this.http.get<ReminderResponse[]>(
      `${this.apiUrl}/lead/${leadId}`
    );

  }


  // ==========================================================
  // GET ORDERED REMINDERS BY LEAD
  // ==========================================================

  getRemindersByLeadOrdered(
    leadId: number
  ): Observable<ReminderResponse[]> {

    return this.http.get<ReminderResponse[]>(
      `${this.apiUrl}/lead/${leadId}/ordered`
    );

  }


  // ==========================================================
  // GET REMINDERS BY FOLLOW-UP
  // ==========================================================

  getRemindersByFollowUp(
    followUpId: number
  ): Observable<ReminderResponse[]> {

    return this.http.get<ReminderResponse[]>(
      `${this.apiUrl}/follow-up/${followUpId}`
    );

  }


  // ==========================================================
  // GET ALL UNREAD REMINDERS
  // ==========================================================

  getUnreadReminders(): Observable<ReminderResponse[]> {

    return this.http.get<ReminderResponse[]>(
      `${this.apiUrl}/unread`
    );

  }


  // ==========================================================
  // GET UNREAD PENDING REMINDERS
  // ==========================================================

  getUnreadPendingReminders(): Observable<ReminderResponse[]> {

    return this.http.get<ReminderResponse[]>(
      `${this.apiUrl}/unread/pending`
    );

  }


  // ==========================================================
  // MARK REMINDER AS READ
  // ==========================================================

  markAsRead(
    reminderId: number
  ): Observable<ReminderResponse> {

    return this.http.patch<ReminderResponse>(
      `${this.apiUrl}/${reminderId}/read`,
      {}
    );

  }


  // ==========================================================
  // GET COMPLETED REMINDERS
  // ==========================================================

  getCompletedReminders(): Observable<ReminderResponse[]> {

    return this.http.get<ReminderResponse[]>(
      `${this.apiUrl}/completed`
    );

  }


  // ==========================================================
  // COMPLETE REMINDER
  // ==========================================================

  completeReminder(
    reminderId: number
  ): Observable<ReminderResponse> {

    return this.http.patch<ReminderResponse>(
      `${this.apiUrl}/${reminderId}/complete`,
      {}
    );

  }


  // ==========================================================
  // GET PENDING REMINDERS
  // ==========================================================

  getPendingReminders(): Observable<ReminderResponse[]> {

    return this.http.get<ReminderResponse[]>(
      `${this.apiUrl}/pending`
    );

  }


  // ==========================================================
  // GET ORDERED PENDING REMINDERS
  // ==========================================================

  getPendingRemindersOrdered(): Observable<ReminderResponse[]> {

    return this.http.get<ReminderResponse[]>(
      `${this.apiUrl}/pending/ordered`
    );

  }


  // ==========================================================
  // GET DISMISSED REMINDERS
  // ==========================================================

  getDismissedReminders(): Observable<ReminderResponse[]> {

    return this.http.get<ReminderResponse[]>(
      `${this.apiUrl}/dismissed`
    );

  }


  // ==========================================================
  // DISMISS REMINDER
  // ==========================================================

  dismissReminder(
    reminderId: number
  ): Observable<ReminderResponse> {

    return this.http.patch<ReminderResponse>(
      `${this.apiUrl}/${reminderId}/dismiss`,
      {}
    );

  }


  // ==========================================================
  // RESTORE REMINDER
  // ==========================================================

  restoreReminder(
    reminderId: number
  ): Observable<ReminderResponse> {

    return this.http.patch<ReminderResponse>(
      `${this.apiUrl}/${reminderId}/restore`,
      {}
    );

  }


  // ==========================================================
  // GET UPCOMING REMINDERS
  // ==========================================================

  getUpcomingReminders(
    dateTime?: string
  ): Observable<ReminderResponse[]> {

    let params = new HttpParams();

    if (dateTime) {
      params = params.set(
        'dateTime',
        dateTime
      );
    }

    return this.http.get<ReminderResponse[]>(
      `${this.apiUrl}/upcoming`,
      { params }
    );

  }


  // ==========================================================
  // GET DUE REMINDERS
  // ==========================================================

  getDueReminders(
    dateTime?: string
  ): Observable<ReminderResponse[]> {

    let params = new HttpParams();

    if (dateTime) {
      params = params.set(
        'dateTime',
        dateTime
      );
    }

    return this.http.get<ReminderResponse[]>(
      `${this.apiUrl}/due`,
      { params }
    );

  }


  // ==========================================================
  // GET REMINDERS WITH PENDING NOTIFICATIONS
  // ==========================================================

  getRemindersWithNotificationPending():
    Observable<ReminderResponse[]> {

    return this.http.get<ReminderResponse[]>(
      `${this.apiUrl}/notifications/pending`
    );

  }


  // ==========================================================
  // GET DUE REMINDERS WITH PENDING NOTIFICATIONS
  // ==========================================================

  getDueRemindersWithNotificationPending(
    dateTime?: string
  ): Observable<ReminderResponse[]> {

    let params = new HttpParams();

    if (dateTime) {
      params = params.set(
        'dateTime',
        dateTime
      );
    }

    return this.http.get<ReminderResponse[]>(
      `${this.apiUrl}/notifications/due`,
      { params }
    );

  }


  // ==========================================================
  // GET REMINDERS WITH SENT NOTIFICATIONS
  // ==========================================================

  getRemindersWithNotificationSent():
    Observable<ReminderResponse[]> {

    return this.http.get<ReminderResponse[]>(
      `${this.apiUrl}/notifications/sent`
    );

  }


  // ==========================================================
  // MARK NOTIFICATION AS SENT
  // ==========================================================

  markNotificationAsSent(
    reminderId: number
  ): Observable<ReminderResponse> {

    return this.http.patch<ReminderResponse>(
      `${this.apiUrl}/${reminderId}/notification-sent`,
      {}
    );

  }


  // ==========================================================
  // SEARCH REMINDERS
  // ==========================================================

  searchRemindersByTitle(
    title: string
  ): Observable<ReminderResponse[]> {

    const params = new HttpParams()
      .set('title', title);

    return this.http.get<ReminderResponse[]>(
      `${this.apiUrl}/search`,
      { params }
    );

  }


  // ==========================================================
  // SEARCH PENDING REMINDERS
  // ==========================================================

  searchPendingRemindersByTitle(
    title: string
  ): Observable<ReminderResponse[]> {

    const params = new HttpParams()
      .set('title', title);

    return this.http.get<ReminderResponse[]>(
      `${this.apiUrl}/search/pending`,
      { params }
    );

  }


  // ==========================================================
  // GET REMINDERS CREATED BY USER
  // ==========================================================

  getRemindersByCreatedBy(
    userId: number
  ): Observable<ReminderResponse[]> {

    return this.http.get<ReminderResponse[]>(
      `${this.apiUrl}/created-by/${userId}`
    );

  }


  // ==========================================================
  // GET REMINDERS UPDATED BY USER
  // ==========================================================

  getRemindersByUpdatedBy(
    userId: number
  ): Observable<ReminderResponse[]> {

    return this.http.get<ReminderResponse[]>(
      `${this.apiUrl}/updated-by/${userId}`
    );

  }


  // ==========================================================
  // CHECK EXISTS BY LEAD
  // ==========================================================

  existsByLeadId(
    leadId: number
  ): Observable<boolean> {

    return this.http.get<boolean>(
      `${this.apiUrl}/exists/lead/${leadId}`
    );

  }


  // ==========================================================
  // CHECK EXISTS BY FOLLOW-UP
  // ==========================================================

  existsByFollowUpId(
    followUpId: number
  ): Observable<boolean> {

    return this.http.get<boolean>(
      `${this.apiUrl}/exists/follow-up/${followUpId}`
    );

  }

}