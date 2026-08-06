import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [

  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  },

  {
    path: 'auth',
    loadChildren: () =>
      import('./features/auth/auth.module')
        .then(m => m.AuthModule)
  },

  {
    path: 'admin',
    loadChildren: () =>
      import('./features/admin/admin.module')
        .then(m => m.AdminModule)
  },

  {
    path: 'executive',
    loadChildren: () =>
      import('./features/executive/executive.module')
        .then(m => m.ExecutiveModule)
  },

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