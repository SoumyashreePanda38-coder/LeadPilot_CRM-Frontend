/**
 * ==========================================================
 * Model : UpcomingVisitResponse
 *
 * Description:
 * Represents an upcoming visit scheduled for a
 * lead/customer and displayed on the dashboard.
 *
 * Used by:
 * - Admin Dashboard
 * - Executive Dashboard
 * - Upcoming Visits section
 * ==========================================================
 */

export interface UpcomingVisitResponse {

  /**
   * Unique identifier of the visit.
   */
  visitId: number;

  /**
   * ID of the lead associated with the visit.
   */
  leadId: number;

  /**
   * Name of the lead/customer associated with the visit.
   */
  leadName: string;

  /**
   * Date and time of the upcoming visit.
   */
  visitDate: string;

  /**
   * Location where the visit will take place.
   */
  location: string;

  /**
   * Name of the executive assigned to the visit.
   */
  assignedExecutive: string;

  /**
   * Current status of the visit.
   *
   * Example:
   * SCHEDULED
   * COMPLETED
   * CANCELLED
   */
  status: string;

}