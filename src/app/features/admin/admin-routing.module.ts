import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AdminLayoutComponent } from '../../layout/admin-layout/admin-layout.component';

import { AdminDashboardComponent } from '../dashboard/admin-dashboard/admin-dashboard.component';

const routes: Routes = [

  {

    path: '',

    component: AdminLayoutComponent,

    children: [

      {

        path: '',

        redirectTo: 'dashboard',

        pathMatch: 'full'

      },

      {

        path: 'dashboard',

        component: AdminDashboardComponent

      },

      {

        path: 'users',

        loadChildren: () =>
          import('../user-management/user-management.module')
            .then(m => m.UserManagementModule)

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

      },

      {

        path: 'settings',

        loadChildren: () =>
          import('../settings/settings.module')
            .then(m => m.SettingsModule)

      }

    ]

  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }