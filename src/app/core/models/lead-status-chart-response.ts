/**
 * ==========================================================
 * MODEL : LeadStatusChartResponse
 *
 * Description :
 * Represents lead status distribution used by dashboard
 * charts.
 *
 * Used by:
 * - Admin Dashboard
 * - Executive Dashboard
 * ==========================================================
 */

export interface LeadStatusChartResponse {

  /**
   * Lead status.
   *
   * Examples:
   * NEW
   * CONTACTED
   * QUALIFIED
   * FOLLOW_UP
   * CONVERTED
   * LOST
   * CLOSED
   */
  status: string;

  /**
   * Number of leads having this status.
   */
  count: number;

}