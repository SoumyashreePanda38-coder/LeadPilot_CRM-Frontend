import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { FollowUpRoutingModule } from './follow-ups-routing.module';

import { AddFollowUpComponent } from './add-follow-up/add-follow-up.component';
import { EditFollowUpComponent } from './edit-follow-up/edit-follow-up.component';
import { FollowUpDetailsComponent } from './follow-up-details/follow-up-details.component';
import { FollowUpListComponent } from './follow-up-list/follow-up-list.component';

@NgModule({
  declarations: [
    AddFollowUpComponent,
    EditFollowUpComponent,
    FollowUpDetailsComponent,
    FollowUpListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FollowUpRoutingModule
  ]
})
export class FollowUpsModule { }