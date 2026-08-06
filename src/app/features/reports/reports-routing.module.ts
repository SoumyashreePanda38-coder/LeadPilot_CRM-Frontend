import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DashboardReportComponent } from './dashboard-report/dashboard-report.component';
import { LeadReportComponent } from './lead-report/lead-report.component';
import { PerformanceReportComponent } from './performance-report/performance-report.component';
import { SalesReportComponent } from './sales-report/sales-report.component';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  {
    path: 'dashboard',
    component: DashboardReportComponent
  },

  {
    path: 'leads',
    component: LeadReportComponent
  },

  {
    path: 'performance',
    component: PerformanceReportComponent
  },

  {
    path: 'sales',
    component: SalesReportComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }