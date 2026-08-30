import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';

import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { ExecutiveLayoutComponent } from './layout/executive-layout/executive-layout.component';


const routes: Routes = [

  // ==========================================================
  // DEFAULT ROUTE
  // ==========================================================

  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },


  // ==========================================================
  // AUTHENTICATION
  // ==========================================================

  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./features/auth/auth.module')
        .then(m => m.AuthModule)
  },


  // ==========================================================
  // ADMIN
  // ==========================================================

  {
    path: 'admin',
    component: AdminLayoutComponent,

    canActivate: [
      AuthGuard,
      RoleGuard
    ],

    data: {
      role: 'ADMIN'
    },

    children: [

      // --------------------------------------------------------
      // ADMIN DASHBOARD
      // --------------------------------------------------------

      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.module')
            .then(m => m.DashboardModule)
      },


      // --------------------------------------------------------
      // USER MANAGEMENT
      // --------------------------------------------------------

      {
        path: 'users',
        loadChildren: () =>
          import('./features/user-management/user-management.module')
            .then(m => m.UserManagementModule)
      },


      // --------------------------------------------------------
      // CUSTOMER LEADS
      // --------------------------------------------------------

      {
        path: 'leads',
        loadChildren: () =>
          import('./features/customer-leads/customer-leads.module')
            .then(m => m.CustomerLeadsModule)
      },


      // --------------------------------------------------------
      // LEAD CONFIGURATION
      // --------------------------------------------------------

      {
        path: 'lead-configuration',
        loadChildren: () =>
          import('./features/lead-configuration/lead-configuration.module')
            .then(m => m.LeadConfigurationModule)
      },


      // --------------------------------------------------------
      // FOLLOW UPS
      // --------------------------------------------------------

      {
        path: 'followups',
        loadChildren: () =>
          import('./features/follow-ups/follow-ups.module')
            .then(m => m.FollowUpsModule)
      },


      // --------------------------------------------------------
      // REMINDERS
      // --------------------------------------------------------

      {
        path: 'reminders',
        loadChildren: () =>
          import('./features/reminders/reminders.module')
            .then(m => m.RemindersModule)
      },


      // --------------------------------------------------------
      // REPORTS
      // --------------------------------------------------------

     


      // --------------------------------------------------------
      // PROFILE
      // --------------------------------------------------------

      {
        path: 'profile',
        loadChildren: () =>
          import('./features/profile/profile.module')
            .then(m => m.ProfileModule)
      },


      // --------------------------------------------------------
      // SETTINGS
      // --------------------------------------------------------

      {
        path: 'settings',
        loadChildren: () =>
          import('./features/settings/settings.module')
            .then(m => m.SettingsModule)
      }

    ]
  },


  // ==========================================================
  // EXECUTIVE
  // ==========================================================

  {
    path: 'executive',
    component: ExecutiveLayoutComponent,

    canActivate: [
      AuthGuard,
      RoleGuard
    ],

    data: {
      role: 'EXECUTIVE'
    },

    children: [

      // --------------------------------------------------------
      // EXECUTIVE DASHBOARD
      // --------------------------------------------------------

      {
        path: 'dashboard',
        loadChildren: () =>
          import('./features/dashboard/dashboard.module')
            .then(m => m.DashboardModule)
      },


      // --------------------------------------------------------
      // CUSTOMER LEADS
      // --------------------------------------------------------

      {
        path: 'leads',
        loadChildren: () =>
          import('./features/customer-leads/customer-leads.module')
            .then(m => m.CustomerLeadsModule)
      },


      // --------------------------------------------------------
      // FOLLOW UPS
      // --------------------------------------------------------

      {
        path: 'followups',
        loadChildren: () =>
          import('./features/follow-ups/follow-ups.module')
            .then(m => m.FollowUpsModule)
      },


      // --------------------------------------------------------
      // REMINDERS
      // --------------------------------------------------------

      {
        path: 'reminders',
        loadChildren: () =>
          import('./features/reminders/reminders.module')
            .then(m => m.RemindersModule)
      },


      // --------------------------------------------------------
      // REPORTS
      // --------------------------------------------------------

      


      // --------------------------------------------------------
      // PROFILE
      // --------------------------------------------------------

      {
        path: 'profile',
        loadChildren: () =>
          import('./features/profile/profile.module')
            .then(m => m.ProfileModule)
      }

    ]
  },


  // ==========================================================
  // INVALID ROUTE
  // ==========================================================

  {
    path: '**',
    redirectTo: 'auth'
  }

];


@NgModule({

  imports: [
    RouterModule.forRoot(routes)
  ],

  exports: [
    RouterModule
  ]

})

export class AppRoutingModule { }