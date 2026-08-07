import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { RoleGuard } from './core/guards/role.guard';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';
import { AdminLayoutComponent } from './layout/admin-layout/admin-layout.component';
import { ExecutiveLayoutComponent } from './layout/executive-layout/executive-layout.component';

const routes: Routes = [

  // Default Route
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },

  // ==========================
  // Authentication
  // ==========================
  {
    path: 'auth',
    component: AuthLayoutComponent,
    loadChildren: () =>
      import('./features/auth/auth.module')
        .then(m => m.AuthModule)
  },

  // ==========================
  // Admin
  // ==========================
  {
    path: 'admin',
    component: AdminLayoutComponent,

     canActivate:[
        AuthGuard,
        RoleGuard
    ],

    data:{
        role:'ADMIN'
    },
    children: [

     {
  path: 'dashboard',
  loadChildren: () =>
    import('./features/dashboard/dashboard.module')
      .then(m => m.DashboardModule)
},

      {
        path: 'users',
        loadChildren: () =>
          import('./features/user-management/user-management.module')
            .then(m => m.UserManagementModule)
      },

      {
        path: 'leads',
        loadChildren: () =>
          import('./features/customer-leads/customer-leads.module')
            .then(m => m.CustomerLeadsModule)
      },

      {
        path: 'followups',
        loadChildren: () =>
          import('./features/follow-ups/follow-ups.module')
            .then(m => m.FollowUpsModule)
      },

      {
        path: 'reminders',
        loadChildren: () =>
          import('./features/reminders/reminders.module')
            .then(m => m.RemindersModule)
      },

      {
        path: 'reports',
        loadChildren: () =>
          import('./features/reports/reports.module')
            .then(m => m.ReportsModule)
      },

      {
        path: 'profile',
        loadChildren: () =>
          import('./features/profile/profile.module')
            .then(m => m.ProfileModule)
      },

      {
        path: 'settings',
        loadChildren: () =>
          import('./features/settings/settings.module')
            .then(m => m.SettingsModule)
      }

    ]
  },

  // ==========================
  // Executive
  // ==========================
  {
    path: 'executive',
    component: ExecutiveLayoutComponent,
    canActivate:[
        AuthGuard,
        RoleGuard
    ],

    data:{
        role:'EXECUTIVE'
    },
    children: [

     {
  path: 'dashboard',
  loadChildren: () =>
    import('./features/dashboard/dashboard.module')
      .then(m => m.DashboardModule)
},
      {
        path: 'leads',
        loadChildren: () =>
          import('./features/customer-leads/customer-leads.module')
            .then(m => m.CustomerLeadsModule)
      },

      {
        path: 'followups',
        loadChildren: () =>
          import('./features/follow-ups/follow-ups.module')
            .then(m => m.FollowUpsModule)
      },

      {
        path: 'reminders',
        loadChildren: () =>
          import('./features/reminders/reminders.module')
            .then(m => m.RemindersModule)
      },

      {
        path: 'reports',
        loadChildren: () =>
          import('./features/reports/reports.module')
            .then(m => m.ReportsModule)
      },

      {
        path: 'profile',
        loadChildren: () =>
          import('./features/profile/profile.module')
            .then(m => m.ProfileModule)
      }

    ]
  },

  // ==========================
  // Invalid Route
  // ==========================
  {
    path: '**',
    redirectTo: 'auth'
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }