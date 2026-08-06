import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { DashboardReportComponent } from './dashboard-report/dashboard-report.component';
import { SalesReportComponent } from './sales-report/sales-report.component';
import { LeadReportComponent } from './lead-report/lead-report.component';
import { PerformanceReportComponent } from './performance-report/performance-report.component';


@NgModule({
  declarations: [
    DashboardReportComponent,
    SalesReportComponent,
    LeadReportComponent,
    PerformanceReportComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule
  ]
})
export class ReportsModule { }
