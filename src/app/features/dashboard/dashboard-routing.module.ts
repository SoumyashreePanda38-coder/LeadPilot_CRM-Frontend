import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { ExecutiveDashboardComponent } from './executive-dashboard/executive-dashboard.component';

const routes: Routes = [

  {
    path: '',
    component: AdminDashboardComponent
  },

  {
    path: 'executive',
    component: ExecutiveDashboardComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule { }