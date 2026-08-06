import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FollowUpListComponent } from './follow-up-list/follow-up-list.component';
import { AddFollowUpComponent } from './add-follow-up/add-follow-up.component';
import { EditFollowUpComponent } from './edit-follow-up/edit-follow-up.component';
import { FollowUpDetailsComponent } from './follow-up-details/follow-up-details.component';

const routes: Routes = [

  {
    path: '',
    component: FollowUpListComponent
  },

  {
    path: 'add',
    component: AddFollowUpComponent
  },

  {
    path: 'edit/:id',
    component: EditFollowUpComponent
  },

  {
    path: 'details/:id',
    component: FollowUpDetailsComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FollowUpRoutingModule { }