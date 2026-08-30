/**
 * ==========================================================
 * Model : MonthlyLeadChartResponse
 *
 * Description:
 * Represents the number of leads generated during
 * a particular month.
 *
 * Used by:
 * - Admin Dashboard
 * - Executive Dashboard
 * - Monthly Lead Chart
 * ==========================================================
 */

export interface MonthlyLeadChartResponse {

  /**
   * Month represented in the chart.
   *
   * Example:
   * January
   * February
   * March
   *
   * Or:
   * 2026-01
   */
  month: string;

  /**
   * Number of leads generated during the month.
   */
  count: number;

}