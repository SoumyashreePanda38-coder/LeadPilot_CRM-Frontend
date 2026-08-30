import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CustomerLeadsRoutingModule } from './customer-leads-routing.module';

import { LeadListComponent } from './lead-list/lead-list.component';
import { AddLeadComponent } from './add-lead/add-lead.component';
import { EditLeadComponent } from './edit-lead/edit-lead.component';
import { ViewLeadComponent } from './view-lead/view-lead.component';
import { LeadOverviewComponent } from './view-lead/lead-overview/lead-overview.component';
import { LeadActivityComponent } from './view-lead/lead-activity/lead-activity.component';
import { LeadNotesComponent } from './view-lead/lead-notes/lead-notes.component';
import { LeadFollowUpsComponent } from './view-lead/lead-follow-ups/lead-follow-ups.component';

@NgModule({
  declarations: [
    LeadListComponent,
    AddLeadComponent,
    EditLeadComponent,
    ViewLeadComponent,
    LeadOverviewComponent,
    LeadActivityComponent,
    LeadNotesComponent,
    LeadFollowUpsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomerLeadsRoutingModule
  ]
})
export class CustomerLeadsModule { }