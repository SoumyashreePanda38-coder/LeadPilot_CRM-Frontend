import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { RemindersRoutingModule } from './reminders-routing.module';

import { ReminderListComponent } from './reminder-list/reminder-list.component';
import { AddReminderComponent } from './add-reminder/add-reminder.component';
import { EditReminderComponent } from './edit-reminder/edit-reminder.component';

@NgModule({
  declarations: [
    ReminderListComponent,
    AddReminderComponent,
    EditReminderComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RemindersRoutingModule
  ]
})
export class RemindersModule { }