import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LeadConfigurationRoutingModule } from './lead-configuration-routing.module';
import { CategoryListComponent } from './lead-category/category-list/category-list.component';
import { CategoryFormComponent } from './lead-category/category-form/category-form.component';
import { SubcategoryListComponent } from './lead-subcategory/subcategory-list/subcategory-list.component';
import { SubcategoryFormComponent } from './lead-subcategory/subcategory-form/subcategory-form.component';
import { SourceListComponent } from './lead-source/source-list/source-list.component';
import { SourceFormComponent } from './lead-source/source-form/source-form.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    CategoryListComponent,
    CategoryFormComponent,
    SubcategoryListComponent,
    SubcategoryFormComponent,
    SourceListComponent,
    SourceFormComponent
  ],
  imports: [
    CommonModule,
    LeadConfigurationRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class LeadConfigurationModule { }
