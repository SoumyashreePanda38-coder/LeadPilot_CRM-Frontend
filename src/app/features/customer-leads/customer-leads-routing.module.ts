import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LeadListComponent } from './lead-list/lead-list.component';
import { AddLeadComponent } from './add-lead/add-lead.component';
import { EditLeadComponent } from './edit-lead/edit-lead.component';
import { ViewLeadComponent } from './view-lead/view-lead.component';

const routes: Routes = [

  {
    path: '',
    component: LeadListComponent
  },

  {
    path: 'add',
    component: AddLeadComponent
  },

  {
    path: 'edit/:id',
    component: EditLeadComponent
  },

  {
    path: 'view/:id',
    component: ViewLeadComponent
  }

];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class CustomerLeadsRoutingModule { }