/**
 * ==========================================================
 * Model : OverdueFollowUpResponse
 *
 * Description:
 * Represents a follow-up that was scheduled in the past
 * but has not yet been completed.
 *
 * Used by:
 * - Admin Dashboard
 * - Executive Dashboard
 * - Overdue Follow-Ups section
 * ==========================================================
 */

export interface OverdueFollowUpResponse {

  /**
   * Unique identifier of the follow-up.
   */
  followUpId: number;

  /**
   * ID of the lead associated with this follow-up.
   */
  leadId: number;

  /**
   * Name of the lead/customer associated with
   * the follow-up.
   */
  leadName: string;

  /**
   * Type of follow-up.
   *
   * Example:
   * CALL
   * EMAIL
   * MEETING
   * VISIT
   */
  followUpType: string;

  /**
   * Date and time when the follow-up was originally scheduled.
   */
  scheduledAt: string;

  /**
   * Current status of the follow-up.
   *
   * Example:
   * SCHEDULED
   * MISSED
   * RESCHEDULED
   */
  status: string;

  /**
   * Name of the executive assigned to the follow-up.
   */
  assignedExecutive: string;

}