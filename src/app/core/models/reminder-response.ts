/**
 * ==========================================================
 * MODEL : ReminderResponse
 *
 * Description:
 * Response model returned by the backend for reminders.
 *
 * Includes:
 * - Lead information
 * - Follow-up information
 * - Assigned user information
 * - Reminder state
 * - Notification tracking
 * - Completion information
 * - Audit information
 * ==========================================================
 */

export interface ReminderResponse {

  // ==========================================================
  // Primary Key
  // ==========================================================

  reminderId: number;

  // ==========================================================
  // Customer Lead Information
  // ==========================================================

  leadId?: number | null;

  leadName?: string | null;

  // ==========================================================
  // Follow-Up Information
  // ==========================================================

  followUpId?: number | null;

  followUpSubject?: string | null;

  // ==========================================================
  // Assigned User Information
  // ==========================================================

  assignedToId: number;

  assignedToName?: string | null;

  // ==========================================================
  // Reminder Information
  // ==========================================================

  title: string;

  message?: string | null;

  /**
   * Java LocalDateTime
   * Example:
   * 2026-08-23T18:30:00
   */
  reminderAt: string;

  // ==========================================================
  // Reminder State
  // ==========================================================

  read: boolean;

  completed: boolean;

  dismissed: boolean;

  // ==========================================================
  // Notification Tracking
  // ==========================================================

  notificationSent: boolean;

  notificationSentAt?: string | null;

  // ==========================================================
  // Completion Information
  // ==========================================================

  completedAt?: string | null;

  // ==========================================================
  // Audit Information
  // ==========================================================

  createdById?: number | null;

  createdByName?: string | null;

  updatedById?: number | null;

  updatedByName?: string | null;

  createdAt?: string | null;

  updatedAt?: string | null;
}