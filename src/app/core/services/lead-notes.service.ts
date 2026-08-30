import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

import { NoteRequest } from '../models/note-request';
import { NoteResponse } from '../models/note-response';

import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LeadNotesService {

  // ==========================================================
  // API URL
  // ==========================================================

  private readonly API_URL =
    `${environment.apiUrl}/notes`;


  // ==========================================================
  // Constructor
  // ==========================================================

  constructor(
    private http: HttpClient
  ) {}


  // ==========================================================
  // CREATE NOTE
  // POST /api/notes?createdById={userId}
  // ==========================================================

  createNote(
    request: NoteRequest,
    createdById: number
  ): Observable<NoteResponse> {

    const params = new HttpParams()
      .set(
        'createdById',
        createdById.toString()
      );

    return this.http.post<NoteResponse>(
      this.API_URL,
      request,
      { params }
    );
  }


  // ==========================================================
  // GET ALL ACTIVE NOTES
  // GET /api/notes
  // ==========================================================

  getAllNotes(): Observable<NoteResponse[]> {

    return this.http.get<NoteResponse[]>(
      this.API_URL
    );
  }


  // ==========================================================
  // GET NOTE BY ID
  // GET /api/notes/{noteId}
  // ==========================================================

  getNoteById(
    noteId: number
  ): Observable<NoteResponse> {

    return this.http.get<NoteResponse>(
      `${this.API_URL}/${noteId}`
    );
  }


  // ==========================================================
  // GET ACTIVE NOTES BY LEAD
  // GET /api/notes/lead/{leadId}
  // ==========================================================

  getNotesByLead(
    leadId: number
  ): Observable<NoteResponse[]> {

    return this.http.get<NoteResponse[]>(
      `${this.API_URL}/lead/${leadId}`
    );
  }


  // ==========================================================
  // GET ALL NOTES BY LEAD
  // Includes soft-deleted notes
  //
  // GET /api/notes/lead/{leadId}/all
  // ==========================================================

  getAllNotesByLead(
    leadId: number
  ): Observable<NoteResponse[]> {

    return this.http.get<NoteResponse[]>(
      `${this.API_URL}/lead/${leadId}/all`
    );
  }


  // ==========================================================
  // UPDATE NOTE
  // PUT /api/notes/{noteId}?updatedById={userId}
  // ==========================================================

  updateNote(
    noteId: number,
    request: NoteRequest,
    updatedById: number
  ): Observable<NoteResponse> {

    const params = new HttpParams()
      .set(
        'updatedById',
        updatedById.toString()
      );

    return this.http.put<NoteResponse>(
      `${this.API_URL}/${noteId}`,
      request,
      { params }
    );
  }


  // ==========================================================
  // DELETE NOTE
  // Soft delete
  //
  // DELETE /api/notes/{noteId}?deletedById={userId}
  // ==========================================================

  deleteNote(
    noteId: number,
    deletedById: number
  ): Observable<void> {

    const params = new HttpParams()
      .set(
        'deletedById',
        deletedById.toString()
      );

    return this.http.delete<void>(
      `${this.API_URL}/${noteId}`,
      { params }
    );
  }


  // ==========================================================
  // RESTORE NOTE
  // PUT /api/notes/{noteId}/restore
  // ==========================================================

  restoreNote(
    noteId: number
  ): Observable<NoteResponse> {

    return this.http.put<NoteResponse>(
      `${this.API_URL}/${noteId}/restore`,
      {}
    );
  }


  // ==========================================================
  // PIN NOTE
  // PUT /api/notes/{noteId}/pin
  // ==========================================================

  pinNote(
    noteId: number
  ): Observable<NoteResponse> {

    return this.http.put<NoteResponse>(
      `${this.API_URL}/${noteId}/pin`,
      {}
    );
  }


  // ==========================================================
  // UNPIN NOTE
  // PUT /api/notes/{noteId}/unpin
  // ==========================================================

  unpinNote(
    noteId: number
  ): Observable<NoteResponse> {

    return this.http.put<NoteResponse>(
      `${this.API_URL}/${noteId}/unpin`,
      {}
    );
  }


  // ==========================================================
  // MARK IMPORTANT
  // PUT /api/notes/{noteId}/important
  // ==========================================================

  markImportant(
    noteId: number
  ): Observable<NoteResponse> {

    return this.http.put<NoteResponse>(
      `${this.API_URL}/${noteId}/important`,
      {}
    );
  }


  // ==========================================================
  // MARK NOT IMPORTANT
  // PUT /api/notes/{noteId}/not-important
  // ==========================================================

  markNotImportant(
    noteId: number
  ): Observable<NoteResponse> {

    return this.http.put<NoteResponse>(
      `${this.API_URL}/${noteId}/not-important`,
      {}
    );
  }


  // ==========================================================
  // GET PINNED NOTES BY LEAD
  // GET /api/notes/lead/{leadId}/pinned
  // ==========================================================

  getPinnedNotesByLead(
    leadId: number
  ): Observable<NoteResponse[]> {

    return this.http.get<NoteResponse[]>(
      `${this.API_URL}/lead/${leadId}/pinned`
    );
  }


  // ==========================================================
  // GET IMPORTANT NOTES BY LEAD
  // GET /api/notes/lead/{leadId}/important
  // ==========================================================

  getImportantNotesByLead(
    leadId: number
  ): Observable<NoteResponse[]> {

    return this.http.get<NoteResponse[]>(
      `${this.API_URL}/lead/${leadId}/important`
    );
  }


  // ==========================================================
  // GET NOTES CREATED BY USER
  // GET /api/notes/created-by/{userId}
  // ==========================================================

  getNotesByCreatedBy(
    userId: number
  ): Observable<NoteResponse[]> {

    return this.http.get<NoteResponse[]>(
      `${this.API_URL}/created-by/${userId}`
    );
  }

}