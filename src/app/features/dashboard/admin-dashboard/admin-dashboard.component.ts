import {
  Component,
  OnInit
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  DashboardService
} from 'src/app/core/services/dashboard.service';

import {
  AdminDashboardResponse
} from '../../../core/models/admin-dashboard-response';

import {
  DashboardSummaryResponse
} from '../../../core/models/dashboard-summary-response';

import {
  LeadStatusChartResponse
} from '../../../core/models/lead-status-chart-response';

import {
  LeadPriorityChartResponse
} from '../../../core/models/lead-priority-chart-response';

import {
  LeadSourceChartResponse
} from '../../../core/models/lead-source-chart-response';

import {
  MonthlyLeadChartResponse
} from '../../../core/models/monthly-lead-chart-response';

import {
  RecentLeadResponse
} from '../../../core/models/recent-lead-response';

import {
  TodayFollowUpResponse
} from '../../../core/models/today-follow-up-response';

import {
  RecentNoteResponse
} from '../../../core/models/recent-note-response';

import {
  UpcomingVisitResponse
} from '../../../core/models/upcoming-visit-response';


/**
 * ==========================================================
 * COMPONENT : AdminDashboardComponent
 *
 * Description :
 * Organization-wide CRM dashboard for ADMIN users.
 *
 * Displays:
 *
 * - Dashboard summary
 * - Lead status distribution
 * - Lead priority distribution
 * - Lead source distribution
 * - Monthly lead generation
 * - Recent leads
 * - Today's follow-ups
 * - Recent notes
 * - Upcoming visits
 *
 * ==========================================================
 */

@Component({
  selector: 'app-admin-dashboard',

  templateUrl:
    './admin-dashboard.component.html',

  styleUrls: [
    './admin-dashboard.component.css'
  ]
})
export class AdminDashboardComponent
  implements OnInit {


  // ==========================================================
  // COMPLETE DASHBOARD RESPONSE
  // ==========================================================

  dashboard:
    AdminDashboardResponse | null = null;


  // ==========================================================
  // DASHBOARD SECTIONS
  // ==========================================================

  summary:
    DashboardSummaryResponse | null = null;

  leadStatus:
    LeadStatusChartResponse[] = [];

  leadPriority:
    LeadPriorityChartResponse[] = [];

  leadSource:
    LeadSourceChartResponse[] = [];

  monthlyLeads:
    MonthlyLeadChartResponse[] = [];

  recentLeads:
    RecentLeadResponse[] = [];

  todayFollowUps:
    TodayFollowUpResponse[] = [];

  recentNotes:
    RecentNoteResponse[] = [];

  upcomingVisits:
    UpcomingVisitResponse[] = [];


  // ==========================================================
  // UI STATE
  // ==========================================================

  isLoading = false;

  errorMessage = '';


  // ==========================================================
  // ADMIN USER ID
  // ==========================================================

  adminUserId: number | null = null;


  // ==========================================================
  // CURRENT DATE
  // ==========================================================

  currentDate = new Date();


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(

    private dashboardService:
      DashboardService,

    private router:
      Router

  ) {}


  // ==========================================================
  // ON INIT
  // ==========================================================

  ngOnInit(): void {

    this.loadAdminUserId();

    if (this.adminUserId) {

      this.loadDashboard();

    } else {

      this.errorMessage =
        'Unable to identify the logged-in Admin user.';

    }

  }


  // ==========================================================
  // LOAD ADMIN USER ID
  // ==========================================================
  //
  // LoginResponse contains:
  //
  // id
  // employeeId
  // fullName
  // username
  // email
  // role
  // token
  //
  // We support the common localStorage structures used
  // by the existing authentication implementation.
  //
  // ==========================================================

  loadAdminUserId(): void {

    const possibleKeys = [
      'user',
      'currentUser',
      'loggedInUser',
      'loginResponse'
    ];


    for (
      const key of possibleKeys
    ) {

      const storedUser =
        localStorage.getItem(key);


      if (!storedUser) {
        continue;
      }


      try {

        const parsedUser =
          JSON.parse(storedUser);


        const id =
          Number(
            parsedUser?.id ??
            parsedUser?.userId
          );


        if (
          Number.isFinite(id) &&
          id > 0
        ) {

          this.adminUserId = id;

          return;

        }

      } catch {

        // Ignore invalid JSON and continue
      }

    }


    // --------------------------------------------------------
    // Optional direct user ID storage
    // --------------------------------------------------------

    const directId =
      localStorage.getItem('userId');


    if (directId) {

      const id =
        Number(directId);


      if (
        Number.isFinite(id) &&
        id > 0
      ) {

        this.adminUserId = id;

      }

    }

  }


  // ==========================================================
  // LOAD DASHBOARD
  // ==========================================================

  loadDashboard(): void {

    if (!this.adminUserId) {

      return;

    }


    this.isLoading = true;

    this.errorMessage = '';


    this.dashboardService
      .getAdminDashboard(
        this.adminUserId
      )
      .subscribe({

        // ====================================================
        // SUCCESS
        // ====================================================

        next: (
          response:
            AdminDashboardResponse
        ) => {

          this.dashboard =
            response;


          // --------------------------------------------------
          // Summary
          // --------------------------------------------------

          this.summary =
            response?.summary || null;


          // --------------------------------------------------
          // Charts
          // --------------------------------------------------

          this.leadStatus =
            response?.leadStatus || [];


          this.leadPriority =
            response?.leadPriority || [];


          this.leadSource =
            response?.leadSource || [];


          this.monthlyLeads =
            response?.monthlyLeads || [];


          // --------------------------------------------------
          // Lists
          // --------------------------------------------------

          this.recentLeads =
            response?.recentLeads || [];


          this.todayFollowUps =
            response?.todayFollowUps || [];


          this.recentNotes =
            response?.recentNotes || [];


          this.upcomingVisits =
            response?.upcomingVisits || [];


          this.isLoading = false;

        },


        // ====================================================
        // ERROR
        // ====================================================

        error: (error) => {

          console.error(
            'Failed to load Admin Dashboard:',
            error
          );


          this.isLoading = false;


          this.dashboard = null;

          this.summary = null;

          this.leadStatus = [];

          this.leadPriority = [];

          this.leadSource = [];

          this.monthlyLeads = [];

          this.recentLeads = [];

          this.todayFollowUps = [];

          this.recentNotes = [];

          this.upcomingVisits = [];


          this.errorMessage =
            error?.error?.message ||
            'Unable to load Admin Dashboard. Please try again.';

        }

      });

  }


  // ==========================================================
  // RETRY
  // ==========================================================

  retryLoad(): void {

    this.loadDashboard();

  }


  // ==========================================================
  // REFRESH
  // ==========================================================

  refreshDashboard(): void {

    this.loadDashboard();

  }


  // ==========================================================
  // FORMAT ENUM
  // ==========================================================

  formatEnum(
    value: string | null | undefined
  ): string {

    if (!value) {

      return '';

    }


    return String(value)

      .replace(
        /_/g,
        ' '
      )

      .toLowerCase()

      .replace(
        /\b\w/g,
        char =>
          char.toUpperCase()
      );

  }


  // ==========================================================
  // GET MONTHLY MAXIMUM
  // ==========================================================

  getMonthlyMaximum(): number {

    if (
      !this.monthlyLeads ||
      this.monthlyLeads.length === 0
    ) {

      return 1;

    }


    const maximum =
      Math.max(
        ...this.monthlyLeads.map(
          item =>
            Number(item.count) || 0
        )
      );


    return maximum > 0
      ? maximum
      : 1;

  }


  // ==========================================================
  // GET STATUS MAXIMUM
  // ==========================================================

  getStatusMaximum(): number {

    if (
      !this.leadStatus ||
      this.leadStatus.length === 0
    ) {

      return 1;

    }


    const maximum =
      Math.max(
        ...this.leadStatus.map(
          item =>
            Number(item.count) || 0
        )
      );


    return maximum > 0
      ? maximum
      : 1;

  }


  // ==========================================================
  // GET PRIORITY MAXIMUM
  // ==========================================================

  getPriorityMaximum(): number {

    if (
      !this.leadPriority ||
      this.leadPriority.length === 0
    ) {

      return 1;

    }


    const maximum =
      Math.max(
        ...this.leadPriority.map(
          item =>
            Number(item.count) || 0
        )
      );


    return maximum > 0
      ? maximum
      : 1;

  }


  // ==========================================================
  // GET SOURCE MAXIMUM
  // ==========================================================

  getSourceMaximum(): number {

    if (
      !this.leadSource ||
      this.leadSource.length === 0
    ) {

      return 1;

    }


    const maximum =
      Math.max(
        ...this.leadSource.map(
          item =>
            Number(item.count) || 0
        )
      );


    return maximum > 0
      ? maximum
      : 1;

  }


  // ==========================================================
  // BAR WIDTH
  // ==========================================================

  getBarWidth(
    count: number,
    maximum: number
  ): number {

    if (
      !maximum ||
      maximum <= 0
    ) {

      return 0;

    }


    return Math.max(
      5,
      Math.min(
        100,
        (count / maximum) * 100
      )
    );

  }


  // ==========================================================
  // MONTH BAR HEIGHT
  // ==========================================================

  getMonthBarHeight(
    count: number
  ): number {

    const maximum =
      this.getMonthlyMaximum();


    if (!maximum) {

      return 0;

    }


    return Math.max(
      8,
      (count / maximum) * 100
    );

  }


  // ==========================================================
  // GET LEAD INITIALS
  // ==========================================================

  getLeadInitials(
    leadName: string | null | undefined
  ): string {

    if (!leadName) {

      return 'CL';

    }


    const parts =
      leadName
        .trim()
        .split(/\s+/);


    if (parts.length === 1) {

      return parts[0]
        .substring(0, 2)
        .toUpperCase();

    }


    return (
      parts[0].charAt(0) +
      parts[parts.length - 1].charAt(0)
    ).toUpperCase();

  }


  // ==========================================================
  // GET STATUS CLASS
  // ==========================================================

  getStatusClass(
    status: string | null | undefined
  ): string {

    if (!status) {

      return 'default';

    }


    return String(status)
      .toLowerCase()
      .replace(
        /_/g,
        '-'
      );

  }


  // ==========================================================
  // GET PRIORITY CLASS
  // ==========================================================

  getPriorityClass(
    priority: string | null | undefined
  ): string {

    if (!priority) {

      return 'default';

    }


    return String(priority)
      .toLowerCase()
      .replace(
        /_/g,
        '-'
      );

  }


  // ==========================================================
  // GET PRIORITY ICON
  // ==========================================================

  getPriorityIcon(
    priority: string | null | undefined
  ): string {

    switch (
      String(priority || '').toUpperCase()
    ) {

      case 'HOT':
        return 'fa-solid fa-fire';

      case 'WARM':
        return 'fa-solid fa-temperature-half';

      case 'COLD':
        return 'fa-solid fa-snowflake';

      default:
        return 'fa-solid fa-circle';

    }

  }


  // ==========================================================
  // GET FOLLOW-UP ICON
  // ==========================================================

  getFollowUpIcon(
    type: string | null | undefined
  ): string {

    switch (
      String(type || '').toUpperCase()
    ) {

      case 'CALL':
        return 'fa-solid fa-phone';

      case 'EMAIL':
        return 'fa-solid fa-envelope';

      case 'MEETING':
        return 'fa-solid fa-handshake';

      case 'VISIT':
        return 'fa-solid fa-location-dot';

      case 'WHATSAPP':
        return 'fa-brands fa-whatsapp';

      default:
        return 'fa-solid fa-calendar-check';

    }

  }


  // ==========================================================
  // GET TOTAL LEADS
  // ==========================================================

  getTotalLeads(): number {

    return Number(
      this.summary?.totalLeads || 0
    );

  }


  // ==========================================================
  // GET ACTIVE LEADS
  // ==========================================================

  getActiveLeads(): number {

    return Number(
      this.summary?.activeLeads || 0
    );

  }


  // ==========================================================
  // GET NEW LEADS TODAY
  // ==========================================================

  getNewLeadsToday(): number {

    return Number(
      this.summary?.newLeadsToday || 0
    );

  }


  // ==========================================================
  // GET PENDING LEADS
  // ==========================================================

  getPendingLeads(): number {

    return Number(
      this.summary?.pendingLeads || 0
    );

  }


  // ==========================================================
  // GET HOT LEADS
  // ==========================================================

  getHotLeads(): number {

    return Number(
      this.summary?.hotLeads || 0
    );

  }


  // ==========================================================
  // GET CLOSED DEALS
  // ==========================================================

  getClosedDeals(): number {

    return Number(
      this.summary?.closedDeals || 0
    );

  }


  // ==========================================================
  // GET LOST LEADS
  // ==========================================================

  getLostLeads(): number {

    return Number(
      this.summary?.lostLeads || 0
    );

  }


  // ==========================================================
  // GET ACTIVE EXECUTIVES
  // ==========================================================

  getActiveExecutives(): number {

    return Number(
      this.summary?.activeExecutives || 0
    );

  }


  // ==========================================================
  // GET FOLLOW-UP COUNTS
  // ==========================================================

  getTotalFollowUps(): number {

    return Number(
      this.summary?.totalFollowUps || 0
    );

  }


  getTodayFollowUpCount(): number {

    return Number(
      this.summary?.todayFollowUps || 0
    );

  }


  getOverdueFollowUpCount(): number {

    return Number(
      this.summary?.overdueFollowUps || 0
    );

  }


  getCompletedFollowUpCount(): number {

    return Number(
      this.summary?.completedFollowUps || 0
    );

  }


  // ==========================================================
  // NAVIGATION
  // ==========================================================

  viewAllLeads(): void {

    this.router.navigate([
      '/admin/leads'
    ]);

  }


  viewAllFollowUps(): void {

    this.router.navigate([
      '/admin/follow-ups'
    ]);

  }


  viewLead(
    leadId: number
  ): void {

    if (!leadId) {

      return;

    }


    this.router.navigate([
      '/admin/leads/view',
      leadId
    ]);

  }


  viewFollowUp(
    leadId: number
  ): void {

    if (!leadId) {

      return;

    }


    this.router.navigate([
      '/admin/leads/view',
      leadId
    ]);

  }


  viewNotes(): void {

    this.router.navigate([
      '/admin/notes'
    ]);

  }


  // ==========================================================
  // TRACK BY HELPERS
  // ==========================================================

  trackByLeadId(
    index: number,
    item: RecentLeadResponse
  ): number {

    return item.leadId || index;

  }


  trackByFollowUpId(
    index: number,
    item: TodayFollowUpResponse
  ): number {

    return item.followUpId || index;

  }


  trackByVisitId(
    index: number,
    item: UpcomingVisitResponse
  ): number {

    return item.visitId || index;

  }


  trackByNoteId(
    index: number,
    item: RecentNoteResponse
  ): number {

    return item.noteId || index;

  }


  trackByChartItem(
    index: number
  ): number {

    return index;

  }

}