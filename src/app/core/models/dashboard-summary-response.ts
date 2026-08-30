/**
 * ==========================================================
 * MODEL : DashboardSummaryResponse
 *
 * Description :
 * Contains summary statistics displayed on the dashboard.
 *
 * Used by:
 * - Admin Dashboard
 * - Executive Dashboard
 *
 * ADMIN:
 * Organization-wide statistics.
 *
 * EXECUTIVE:
 * Statistics belonging to the authenticated executive.
 * ==========================================================
 */

export interface DashboardSummaryResponse {

  // ==========================================================
  // LEAD STATISTICS
  // ==========================================================

  totalLeads: number;

  activeLeads: number;

  newLeadsToday: number;

  pendingLeads: number;

  hotLeads: number;

  closedDeals: number;

  lostLeads: number;

  // ==========================================================
  // EXECUTIVE STATISTICS
  // ==========================================================

  activeExecutives: number;

  // ==========================================================
  // FOLLOW-UP STATISTICS
  // ==========================================================

  totalFollowUps: number;

  todayFollowUps: number;

  overdueFollowUps: number;

  completedFollowUps: number;

}