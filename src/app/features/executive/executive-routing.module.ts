import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ExecutiveLayoutComponent } from '../../layout/executive-layout/executive-layout.component';

import { ExecutiveDashboardComponent } from '../dashboard/executive-dashboard/executive-dashboard.component';

const routes: Routes = [

  {

    path: '',

    component: ExecutiveLayoutComponent,

    children: [

      {

        path: '',

        redirectTo: 'dashboard',

        pathMatch: 'full'

      },

      {

        path: 'dashboard',

        component: ExecutiveDashboardComponent

      },

      {

        path: 'customer-leads',

        loadChildren: () =>
          import('../customer-leads/customer-leads.module')
            .then(m => m.CustomerLeadsModule)

      },

      {

        path: 'follow-ups',

        loadChildren: () =>
          import('../follow-ups/follow-ups.module')
            .then(m => m.FollowUpsModule)

      },

      {

        path: 'reminders',

        loadChildren: () =>
          import('../reminders/reminders.module')
            .then(m => m.RemindersModule)

      },

      {

        path: 'reports',

        loadChildren: () =>
          import('../reports/reports.module')
            .then(m => m.ReportsModule)

      },

      {

        path: 'profile',

        loadChildren: () =>
          import('../profile/profile.module')
            .then(m => m.ProfileModule)

      }

    ]

  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExecutiveRoutingModule { }