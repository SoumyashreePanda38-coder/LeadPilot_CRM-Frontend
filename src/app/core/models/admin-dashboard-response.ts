import { DashboardSummaryResponse } from './dashboard-summary-response';
import { LeadStatusChartResponse } from './lead-status-chart-response';
import { LeadPriorityChartResponse } from './lead-priority-chart-response';
import { LeadSourceChartResponse } from './lead-source-chart-response';

import { MonthlyLeadChartResponse } from './monthly-lead-chart-response';
import { RecentLeadResponse } from './recent-lead-response';
import { TodayFollowUpResponse } from './today-follow-up-response';
import { RecentNoteResponse } from './recent-note-response';
import { UpcomingVisitResponse } from './upcoming-visit-response';


/**
 * ==========================================================
 * MODEL : AdminDashboardResponse
 *
 * Description :
 * Complete dashboard response for ADMIN.
 *
 * Contains organization-wide CRM information.
 * ==========================================================
 */

export interface AdminDashboardResponse {

  // ==========================================================
  // DASHBOARD SUMMARY
  // ==========================================================

  summary: DashboardSummaryResponse;

  // ==========================================================
  // LEAD STATUS
  // ==========================================================

  leadStatus: LeadStatusChartResponse[];

  // ==========================================================
  // LEAD PRIORITY
  // ==========================================================

  leadPriority: LeadPriorityChartResponse[];

  // ==========================================================
  // LEAD SOURCE
  // ==========================================================

  leadSource: LeadSourceChartResponse[];

  // ==========================================================
  // MONTHLY LEADS
  // ==========================================================

  monthlyLeads: MonthlyLeadChartResponse[];

  // ==========================================================
  // RECENT LEADS
  // ==========================================================

  recentLeads: RecentLeadResponse[];

  // ==========================================================
  // TODAY'S FOLLOW-UPS
  // ==========================================================

  todayFollowUps: TodayFollowUpResponse[];

  // ==========================================================
  // RECENT NOTES
  // ==========================================================

  recentNotes: RecentNoteResponse[];

  // ==========================================================
  // UPCOMING VISITS
  // ==========================================================

  upcomingVisits: UpcomingVisitResponse[];

}