import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NgChartsModule } from 'ng2-charts';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ExecutiveDashboardComponent } from './executive-dashboard/executive-dashboard.component';
import { DashboardCardComponent } from './dashboard-card/dashboard-card.component';
import { DashboardChartsComponent } from './dashboard-charts/dashboard-charts.component';

@NgModule({
  declarations: [
    AdminDashboardComponent,
    ExecutiveDashboardComponent,
    DashboardCardComponent,
    DashboardChartsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    DashboardRoutingModule
  ]
})
export class DashboardModule { }