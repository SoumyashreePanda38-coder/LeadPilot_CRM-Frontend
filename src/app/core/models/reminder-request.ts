/**
 * ==========================================================
 * MODEL : ReminderRequest
 *
 * Description:
 * Request model used when creating or updating a reminder.
 *
 * Reminders are normally generated automatically from
 * follow-ups, so the frontend should generally NOT manually
 * set read/completed/dismissed values.
 * ==========================================================
 */

export interface ReminderRequest {

  // ==========================================================
  // Related Customer Lead
  // ==========================================================

  leadId?: number | null;

  // ==========================================================
  // Related Follow-Up
  // ==========================================================

  followUpId?: number | null;

  // ==========================================================
  // Assigned User
  // ==========================================================

  assignedToId: number;

  // ==========================================================
  // Reminder Information
  // ==========================================================

  title: string;

  message?: string;

  // ==========================================================
  // Reminder Date & Time
  // ==========================================================

  /**
   * Java LocalDateTime
   * Example: 2026-08-23T18:30:00
   */
  reminderAt: string;

  // ==========================================================
  // Reminder State
  // ==========================================================

  /**
   * Normally controlled by backend.
   */
  read?: boolean;

  /**
   * Normally controlled by backend.
   */
  completed?: boolean;

  /**
   * Normally controlled by backend.
   */
  dismissed?: boolean;
}