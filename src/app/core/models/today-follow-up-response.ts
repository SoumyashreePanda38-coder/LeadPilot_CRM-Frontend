/**
 * ==========================================================
 * Model : TodayFollowUpResponse
 *
 * Description:
 * Represents a follow-up scheduled for today and displayed
 * on the dashboard.
 *
 * Used by:
 * - Admin Dashboard
 * - Executive Dashboard
 * - Today's Follow-Ups section
 * ==========================================================
 */

export interface TodayFollowUpResponse {

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
   * Date and time at which the follow-up is scheduled.
   */
  scheduledAt: string;

  /**
   * Current status of the follow-up.
   *
   * Example:
   * SCHEDULED
   * COMPLETED
   * MISSED
   * RESCHEDULED
   * CANCELLED
   */
  status: string;

  /**
   * Name of the executive assigned to the follow-up.
   */
  assignedExecutive: string;

}