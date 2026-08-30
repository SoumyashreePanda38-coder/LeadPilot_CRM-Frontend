import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { FollowUpListComponent } from './follow-up-list/follow-up-list.component';
import { AddFollowUpComponent } from './add-follow-up/add-follow-up.component';
import { EditFollowUpComponent } from './edit-follow-up/edit-follow-up.component';

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

 

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FollowUpRoutingModule { }