/**
 * ==========================================================
 * MODEL : LeadPriorityChartResponse
 *
 * Description :
 * Represents lead priority distribution used by the
 * dashboard priority chart.
 *
 * Used by:
 * - Admin Dashboard
 * - Executive Dashboard
 * ==========================================================
 */

export interface LeadPriorityChartResponse {

  /**
   * Lead priority.
   *
   * Examples:
   * HOT
   * WARM
   * COLD
   * NOT_A_CUSTOMER
   */
  priority: string;

  /**
   * Number of leads having this priority.
   */
  count: number;

}