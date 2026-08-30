import { DashboardSummaryResponse } from './dashboard-summary-response';
import { LeadStatusChartResponse } from './lead-status-chart-response';
import { LeadPriorityChartResponse } from './lead-priority-chart-response';
import { LeadSourceChartResponse } from './lead-source-chart-response';

import { MonthlyLeadChartResponse } from './monthly-lead-chart-response';
import { RecentLeadResponse } from './recent-lead-response';
import { TodayFollowUpResponse } from './today-follow-up-response';
import { RecentNoteResponse } from './recent-note-response';
import { UpcomingVisitResponse } from './upcoming-visit-response';
import { OverdueFollowUpResponse } from './overdue-follow-up-response';


/**
 * ==========================================================
 * MODEL : ExecutiveDashboardResponse
 *
 * Description :
 * Complete dashboard response for EXECUTIVE.
 *
 * Contains information belonging only to the authenticated
 * executive.
 * ==========================================================
 */

export interface ExecutiveDashboardResponse {

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

  // ==========================================================
  // OVERDUE FOLLOW-UPS
  // ==========================================================

  overdueFollowUps: OverdueFollowUpResponse[];

}