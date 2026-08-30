import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LeadSubCategoryService } from '../../../../core/services/lead-subcategory.service';
import { LeadCategoryService } from '../../../../core/services/lead-category.service';

import { LeadSubCategoryResponse } from '../../../../core/models/lead-subcategory-response';
import { LeadCategoryResponse } from '../../../../core/models/lead-category-response';

import { LeadCategoryStatus } from '../../../../core/models/lead-category-status.enum';


@Component({
  selector: 'app-subcategory-list',
  templateUrl: './subcategory-list.component.html',
  styleUrls: ['./subcategory-list.component.css']
})
export class SubcategoryListComponent implements OnInit {

  // ==========================================================
  // SUBCATEGORY DATA
  // ==========================================================

  subCategories: LeadSubCategoryResponse[] = [];

  filteredSubCategories: LeadSubCategoryResponse[] = [];


  // ==========================================================
  // CATEGORY DATA
  // Used for parent category dropdown
  // ==========================================================

  categories: LeadCategoryResponse[] = [];


  // ==========================================================
  // LOADING / ERROR / SUCCESS
  // ==========================================================

  loading = false;

  errorMessage = '';

  successMessage = '';


  // ==========================================================
  // SEARCH
  // ==========================================================

  searchText = '';


  // ==========================================================
  // CATEGORY FILTER
  // ==========================================================

  selectedCategoryId: number | 'ALL' = 'ALL';


  // ==========================================================
  // STATUS FILTER
  // ==========================================================

  selectedStatus: 'ALL' | LeadCategoryStatus = 'ALL';


  // ==========================================================
  // STATUS ENUM
  //
  // IMPORTANT:
  // The HTML uses CategoryStatus.ACTIVE / INACTIVE.
  // Therefore we expose LeadCategoryStatus using the
  // CategoryStatus name for the template.
  // ==========================================================

  readonly CategoryStatus = LeadCategoryStatus;


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(
    private leadSubCategoryService: LeadSubCategoryService,
    private leadCategoryService: LeadCategoryService,
    private router: Router
  ) {}


  // ==========================================================
  // LIFECYCLE
  // ==========================================================

  ngOnInit(): void {

    this.loadCategories();

    this.loadSubCategories();

  }


  // ==========================================================
  // LOAD CATEGORIES
  // ==========================================================

  loadCategories(): void {

    this.leadCategoryService
      .getAllCategories()
      .subscribe({

        next: (response: LeadCategoryResponse[]) => {

          this.categories = response;

          /*
           * Re-apply filters because the category name
           * may initially be unavailable when subcategories
           * are loaded first.
           */
          this.applyFilters();

        },

        error: (error) => {

          console.error(
            'Error loading lead categories:',
            error
          );

          this.errorMessage =
            'Unable to load lead categories.';

        }

      });

  }


  // ==========================================================
  // LOAD ALL SUBCATEGORIES
  // ==========================================================

  loadSubCategories(): void {

    this.loading = true;

    this.errorMessage = '';

    this.leadSubCategoryService
      .getAllSubCategories()
      .subscribe({

        next: (
          response: LeadSubCategoryResponse[]
        ) => {

          this.subCategories = response;

          this.applyFilters();

          this.loading = false;

        },

        error: (error) => {

          console.error(
            'Error loading lead subcategories:',
            error
          );

          this.errorMessage =
            'Unable to load lead subcategories. Please try again.';

          this.loading = false;

        }

      });

  }


  // ==========================================================
  // SEARCH
  // ==========================================================

  onSearch(): void {

    this.applyFilters();

  }


  // ==========================================================
  // CLEAR SEARCH
  // ==========================================================

  clearSearch(): void {

    this.searchText = '';

    this.applyFilters();

  }


  // ==========================================================
  // CATEGORY FILTER
  // ==========================================================

  onCategoryChange(): void {

    this.applyFilters();

  }


  // ==========================================================
  // STATUS FILTER
  // ==========================================================

  onStatusChange(): void {

    this.applyFilters();

  }


  // ==========================================================
  // CLEAR ALL FILTERS
  // ==========================================================

  clearFilters(): void {

    this.searchText = '';

    this.selectedCategoryId = 'ALL';

    this.selectedStatus = 'ALL';

    this.applyFilters();

  }


  // ==========================================================
  // APPLY ALL FILTERS
  // ==========================================================

  applyFilters(): void {

    let result = [...this.subCategories];


    // --------------------------------------------------------
    // SEARCH FILTER
    // --------------------------------------------------------

    if (this.searchText.trim()) {

      const searchValue =
        this.searchText
          .trim()
          .toLowerCase();


      result = result.filter(
        subCategory => {

          const subCategoryName =
            subCategory.subCategoryName
              ?.toLowerCase() || '';


          const description =
            subCategory.description
              ?.toLowerCase() || '';


          const categoryName =
            (
              subCategory.categoryName ||
              this.getCategoryName(
                subCategory.categoryId
              )
            )
              ?.toLowerCase() || '';


          return (
            subCategoryName.includes(searchValue) ||
            description.includes(searchValue) ||
            categoryName.includes(searchValue)
          );

        }
      );

    }


    // --------------------------------------------------------
    // CATEGORY FILTER
    // --------------------------------------------------------

    if (this.selectedCategoryId !== 'ALL') {

      result = result.filter(
        subCategory =>
          subCategory.categoryId ===
          this.selectedCategoryId
      );

    }


    // --------------------------------------------------------
    // STATUS FILTER
    // --------------------------------------------------------

    if (this.selectedStatus !== 'ALL') {

      result = result.filter(
        subCategory =>
          subCategory.status ===
          this.selectedStatus
      );

    }


    // --------------------------------------------------------
    // FINAL RESULT
    // --------------------------------------------------------

    this.filteredSubCategories = result;

  }


  // ==========================================================
  // GET CATEGORY NAME
  // ==========================================================

  getCategoryName(categoryId: number): string {

    const category =
      this.categories.find(
        category =>
          category.categoryId === categoryId
      );


    return category
      ? category.categoryName
      : 'Unknown Category';

  }


  // ==========================================================
  // VIEW SUBCATEGORY
  // ==========================================================

  viewSubCategory(
    subCategoryId: number
  ): void {

    if (!subCategoryId) {
      return;
    }


    this.leadSubCategoryService
      .getSubCategoryById(subCategoryId)
      .subscribe({

        next: (subCategory) => {

          console.log(
            'Subcategory:',
            subCategory
          );

          /*
           * For now the subcategory is logged
           * to the console.
           *
           * Later this can be replaced with:
           * - View Subcategory page
           * - Modal
           * - Side drawer
           */

        },

        error: (error) => {

          console.error(
            'Error loading subcategory:',
            error
          );

          this.errorMessage =
            'Unable to load subcategory details.';

        }

      });

  }


  // ==========================================================
  // EDIT SUBCATEGORY
  // ==========================================================

  editSubCategory(
    subCategoryId: number
  ): void {

    if (!subCategoryId) {
      return;
    }


    this.router.navigate([
      '/admin/lead-configuration/subcategory/edit',
      subCategoryId
    ]);

  }


  // ==========================================================
  // ADD SUBCATEGORY
  // ==========================================================

  addSubCategory(): void {

    this.router.navigate([
      '/admin/lead-configuration/subcategory/add'
    ]);

  }


  // ==========================================================
  // TOGGLE STATUS
  // ==========================================================

  toggleStatus(
    subCategory: LeadSubCategoryResponse
  ): void {

    if (!subCategory.subCategoryId) {
      return;
    }


    this.clearMessages();


    // --------------------------------------------------------
    // ACTIVE → DEACTIVATE
    // --------------------------------------------------------

    if (
      subCategory.status ===
      LeadCategoryStatus.ACTIVE
    ) {

      this.deactivateSubCategory(
        subCategory
      );

      return;

    }


    // --------------------------------------------------------
    // INACTIVE → ACTIVATE
    // --------------------------------------------------------

    this.activateSubCategory(
      subCategory
    );

  }


  // ==========================================================
  // ACTIVATE SUBCATEGORY
  // ==========================================================

  activateSubCategory(
    subCategory: LeadSubCategoryResponse
  ): void {

    if (!subCategory.subCategoryId) {
      return;
    }


    this.clearMessages();


    this.leadSubCategoryService
      .activateSubCategory(
        subCategory.subCategoryId
      )
      .subscribe({

        next: (
          updatedSubCategory
        ) => {

          this.updateSubCategoryInList(
            updatedSubCategory
          );


          this.successMessage =
            'Subcategory activated successfully.';

        },

        error: (error) => {

          console.error(
            'Error activating subcategory:',
            error
          );

          this.errorMessage =
            'Unable to activate subcategory.';

        }

      });

  }


  // ==========================================================
  // DEACTIVATE SUBCATEGORY
  // ==========================================================

  deactivateSubCategory(
    subCategory: LeadSubCategoryResponse
  ): void {

    if (!subCategory.subCategoryId) {
      return;
    }


    this.clearMessages();


    this.leadSubCategoryService
      .deactivateSubCategory(
        subCategory.subCategoryId
      )
      .subscribe({

        next: (
          updatedSubCategory
        ) => {

          this.updateSubCategoryInList(
            updatedSubCategory
          );


          this.successMessage =
            'Subcategory deactivated successfully.';

        },

        error: (error) => {

          console.error(
            'Error deactivating subcategory:',
            error
          );

          this.errorMessage =
            'Unable to deactivate subcategory.';

        }

      });

  }


  // ==========================================================
  // UPDATE LOCAL LIST
  // ==========================================================

  private updateSubCategoryInList(
    updatedSubCategory: LeadSubCategoryResponse
  ): void {

    const index =
      this.subCategories.findIndex(
        subCategory =>
          subCategory.subCategoryId ===
          updatedSubCategory.subCategoryId
      );


    if (index !== -1) {

      this.subCategories[index] =
        updatedSubCategory;


      /*
       * Create a new array reference so Angular
       * detects the change.
       */

      this.subCategories =
        [...this.subCategories];


      this.applyFilters();

    }

  }


  // ==========================================================
  // DELETE SUBCATEGORY
  // ==========================================================

  deleteSubCategory(
    subCategory: LeadSubCategoryResponse
  ): void {

    if (!subCategory.subCategoryId) {
      return;
    }


    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${subCategory.subCategoryName}"?`
      );


    if (!confirmed) {
      return;
    }


    this.clearMessages();


    this.leadSubCategoryService
      .deleteSubCategory(
        subCategory.subCategoryId
      )
      .subscribe({

        next: () => {

          /*
           * Remove deleted subcategory
           * from local array.
           */

          this.subCategories =
            this.subCategories.filter(
              item =>
                item.subCategoryId !==
                subCategory.subCategoryId
            );


          this.applyFilters();


          this.successMessage =
            'Subcategory deleted successfully.';

        },

        error: (error) => {

          console.error(
            'Error deleting subcategory:',
            error
          );

          this.errorMessage =
            'Unable to delete subcategory.';

        }

      });

  }


  // ==========================================================
  // REFRESH
  // ==========================================================

  refreshSubCategories(): void {

    this.clearMessages();

    this.loadSubCategories();

  }


  // ==========================================================
  // CLEAR ALERT MESSAGES
  // ==========================================================

  private clearMessages(): void {

    this.errorMessage = '';

    this.successMessage = '';

  }


  // ==========================================================
  // TRACK BY
  // ==========================================================

  trackBySubCategoryId(
    index: number,
    subCategory: LeadSubCategoryResponse
  ): number {

    return subCategory.subCategoryId;

  }


  // ==========================================================
  // TOTAL SUBCATEGORY COUNT
  // ==========================================================

  get totalSubCategoryCount(): number {

    return this.subCategories.length;

  }


  // ==========================================================
  // ACTIVE SUBCATEGORY COUNT
  // ==========================================================

  get activeSubCategoryCount(): number {

    return this.subCategories.filter(
      subCategory =>
        subCategory.status ===
        LeadCategoryStatus.ACTIVE
    ).length;

  }


  // ==========================================================
  // INACTIVE SUBCATEGORY COUNT
  // ==========================================================

  get inactiveSubCategoryCount(): number {

    return this.subCategories.filter(
      subCategory =>
        subCategory.status ===
        LeadCategoryStatus.INACTIVE
    ).length;

  }


  // ==========================================================
  // FILTERED SUBCATEGORY COUNT
  // ==========================================================

  get filteredSubCategoryCount(): number {

    return this.filteredSubCategories.length;

  }

}