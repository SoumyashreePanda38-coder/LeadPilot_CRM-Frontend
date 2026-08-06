import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { MyProfileComponent } from './my-profile/my-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [

  {
    path: '',
    component: MyProfileComponent
  },

  {
    path: 'change-password',
    component: ChangePasswordComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }