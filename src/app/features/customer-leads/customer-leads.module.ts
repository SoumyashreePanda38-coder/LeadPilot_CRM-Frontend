import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { CustomerLeadsRoutingModule } from './customer-leads-routing.module';

import { LeadListComponent } from './lead-list/lead-list.component';
import { AddLeadComponent } from './add-lead/add-lead.component';
import { EditLeadComponent } from './edit-lead/edit-lead.component';
import { ViewLeadComponent } from './view-lead/view-lead.component';

@NgModule({
  declarations: [
    LeadListComponent,
    AddLeadComponent,
    EditLeadComponent,
    ViewLeadComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CustomerLeadsRoutingModule
  ]
})
export class CustomerLeadsModule { }