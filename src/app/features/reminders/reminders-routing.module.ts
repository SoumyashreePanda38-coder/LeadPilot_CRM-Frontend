import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ReminderListComponent } from './reminder-list/reminder-list.component';
import { AddReminderComponent } from './add-reminder/add-reminder.component';
import { EditReminderComponent } from './edit-reminder/edit-reminder.component';

const routes: Routes = [

  {
    path: '',
    component: ReminderListComponent
  },

  {
    path: 'add',
    component: AddReminderComponent
  },

  {
    path: 'edit/:id',
    component: EditReminderComponent
  }

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RemindersRoutingModule { }