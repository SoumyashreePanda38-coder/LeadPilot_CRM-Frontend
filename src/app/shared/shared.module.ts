import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { FooterComponent } from './components/footer/footer.component';
import { LoaderComponent } from './components/loader/loader.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { AccessDeniedComponent } from './components/access-denied/access-denied.component';
import { ConfirmDialogComponent } from './components/confirm-dialog/confirm-dialog.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { BreadcrumbComponent } from './components/breadcrumb/breadcrumb.component';

import { OnlyNumberDirective } from './directives/only-number.directive';
import { HasRoleDirective } from './directives/has-role.directive';

import { SearchPipe } from './pipes/search.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { AdminNavbarComponent } from './components/admin-navbar/admin-navbar.component';
import { ExecutiveNavbarComponent } from './components/executive-navbar/executive-navbar.component';
import { AdminSidebarComponent } from './components/admin-sidebar/admin-sidebar.component';
import { ExecutiveSidebarComponent } from './components/executive-sidebar/executive-sidebar.component';

@NgModule({
  declarations: [

    FooterComponent,
    LoaderComponent,
    PageNotFoundComponent,
    AccessDeniedComponent,
    ConfirmDialogComponent,
    DeleteDialogComponent,
    BreadcrumbComponent,
    OnlyNumberDirective,
    HasRoleDirective,
    SearchPipe,
    FilterPipe,
    DateFormatPipe,
    AdminNavbarComponent,
    ExecutiveNavbarComponent,
    AdminSidebarComponent,
    ExecutiveSidebarComponent
  ],

  imports: [
    CommonModule,
    FormsModule,
    RouterModule

  ],

  exports: [
    CommonModule,
    FormsModule,
    RouterModule,

    FooterComponent,
    LoaderComponent,
    PageNotFoundComponent,
    AccessDeniedComponent,
    ConfirmDialogComponent,
    DeleteDialogComponent,
    BreadcrumbComponent,
    AdminNavbarComponent,
    ExecutiveNavbarComponent,
    AdminSidebarComponent,
    ExecutiveSidebarComponent,

    OnlyNumberDirective,
    HasRoleDirective,

    SearchPipe,
    FilterPipe,
    DateFormatPipe
  ]
})
export class SharedModule { }