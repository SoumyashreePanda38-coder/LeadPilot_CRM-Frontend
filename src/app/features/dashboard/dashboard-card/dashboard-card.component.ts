import {
  Component,
  Input
} from '@angular/core';

import {
  DashboardSummaryResponse
} from '../../../core/models/dashboard-summary-response';


@Component({
  selector: 'app-dashboard-card',
  templateUrl: './dashboard-card.component.html',
  styleUrls: ['./dashboard-card.component.css']
})
export class DashboardCardComponent {

  @Input()
  summary: DashboardSummaryResponse | null = null;


  getTotalLeads(): number {
    return Number(this.summary?.totalLeads) || 0;
  }


  getActiveLeads(): number {
    return Number(this.summary?.activeLeads) || 0;
  }


  getNewLeadsToday(): number {
    return Number(this.summary?.newLeadsToday) || 0;
  }


  getPendingLeads(): number {
    return Number(this.summary?.pendingLeads) || 0;
  }


  getHotLeads(): number {
    return Number(this.summary?.hotLeads) || 0;
  }


  getClosedDeals(): number {
    return Number(this.summary?.closedDeals) || 0;
  }


  getLostLeads(): number {
    return Number(this.summary?.lostLeads) || 0;
  }


  getActiveExecutives(): number {
    return Number(this.summary?.activeExecutives) || 0;
  }

}