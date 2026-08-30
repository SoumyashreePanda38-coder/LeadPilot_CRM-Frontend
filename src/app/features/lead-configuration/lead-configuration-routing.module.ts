import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CategoryListComponent } from './lead-category/category-list/category-list.component';
import { CategoryFormComponent } from './lead-category/category-form/category-form.component';

import { SubcategoryListComponent } from './lead-subcategory/subcategory-list/subcategory-list.component';
import { SubcategoryFormComponent } from './lead-subcategory/subcategory-form/subcategory-form.component';

import { SourceListComponent } from './lead-source/source-list/source-list.component';
import { SourceFormComponent } from './lead-source/source-form/source-form.component';


const routes: Routes = [

  // ==========================================================
  // DEFAULT LEAD CONFIGURATION ROUTE
  // ==========================================================

  {
    path: '',
    redirectTo: 'category',
    pathMatch: 'full'
  },


  // ==========================================================
  // LEAD CATEGORY
  // ==========================================================

  {
    path: 'category',
    children: [

      // /admin/lead-configuration/category
      {
        path: '',
        component: CategoryListComponent
      },

      // /admin/lead-configuration/category/add
      {
        path: 'add',
        component: CategoryFormComponent
      },

      // /admin/lead-configuration/category/edit/1
      {
        path: 'edit/:id',
        component: CategoryFormComponent
      }

    ]
  },


  // ==========================================================
  // LEAD SUBCATEGORY
  // ==========================================================

  {
    path: 'subcategory',
    children: [

      // /admin/lead-configuration/subcategory
      {
        path: '',
        component: SubcategoryListComponent
      },

      // /admin/lead-configuration/subcategory/add
      {
        path: 'add',
        component: SubcategoryFormComponent
      },

      // /admin/lead-configuration/subcategory/edit/1
      {
        path: 'edit/:id',
        component: SubcategoryFormComponent
      }

    ]
  },


  // ==========================================================
  // LEAD SOURCE
  // ==========================================================

  {
    path: 'source',
    children: [

      // /admin/lead-configuration/source
      {
        path: '',
        component: SourceListComponent
      },

      // /admin/lead-configuration/source/add
      {
        path: 'add',
        component: SourceFormComponent
      },

      // /admin/lead-configuration/source/edit/1
      {
        path: 'edit/:id',
        component: SourceFormComponent
      }

    ]
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
export class LeadConfigurationRoutingModule { }