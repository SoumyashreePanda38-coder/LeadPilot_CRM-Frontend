/**
 * ==========================================================
 * Model : RecentNoteResponse
 *
 * Description:
 * Represents a recent note/activity associated with a lead
 * and displayed on the dashboard.
 *
 * Used by:
 * - Admin Dashboard
 * - Executive Dashboard
 * - Recent Notes section
 * ==========================================================
 */

export interface RecentNoteResponse {

  /**
   * Unique identifier of the note.
   */
  noteId: number;

  /**
   * ID of the lead associated with the note.
   */
  leadId: number;

  /**
   * Name of the lead/customer associated with the note.
   */
  leadName: string;

  /**
   * Content of the note.
   */
  note: string;

  /**
   * Name of the user who created the note.
   */
  createdBy: string;

  /**
   * Date and time when the note was created.
   */
  createdAt: string;

}