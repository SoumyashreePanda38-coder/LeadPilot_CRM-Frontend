import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { LeadCategoryService } from '../../../../core/services/lead-category.service';
import { LeadCategoryResponse } from '../../../../core/models/lead-category-response';
import { LeadCategoryStatus } from '../../../../core/models/lead-category-status.enum';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  // ==========================================================
  // CATEGORY DATA
  // ==========================================================

  categories: LeadCategoryResponse[] = [];

  filteredCategories: LeadCategoryResponse[] = [];

  // ==========================================================
  // LOADING / ERROR / SUCCESS
  // ==========================================================

  loading = false;

  errorMessage = '';

  successMessage = '';

  // ==========================================================
  // SEARCH
  // ==========================================================

  /**
   * Used by the HTML search box.
   */
  searchTerm = '';

  /**
   * Compatibility property.
   *
   * If any older HTML/TypeScript code uses searchText,
   * it will still work.
   */
  get searchText(): string {
    return this.searchTerm;
  }

  set searchText(value: string) {
    this.searchTerm = value;
  }

  // ==========================================================
  // STATUS FILTER
  // ==========================================================

  selectedStatus: 'ALL' | LeadCategoryStatus = 'ALL';

  // ==========================================================
  // STATUS ENUM
  // ==========================================================

  readonly CategoryStatus = LeadCategoryStatus;

  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(
    private leadCategoryService: LeadCategoryService,
    private router: Router
  ) {}

  // ==========================================================
  // LIFECYCLE
  // ==========================================================

  ngOnInit(): void {
    this.loadCategories();
  }

  // ==========================================================
  // LOAD ALL CATEGORIES
  // ==========================================================

  loadCategories(): void {

    this.loading = true;
    this.errorMessage = '';

    this.leadCategoryService.getAllCategories().subscribe({

      next: (response: LeadCategoryResponse[]) => {

        this.categories = response;

        this.applyFilters();

        this.loading = false;
      },

      error: (error) => {

        console.error(
          'Error loading lead categories:',
          error
        );

        this.errorMessage =
          'Unable to load lead categories. Please try again.';

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

    this.searchTerm = '';

    this.applyFilters();
  }

  // ==========================================================
  // STATUS FILTER
  // ==========================================================

  onStatusChange(): void {
    this.applyFilters();
  }

  // ==========================================================
  // APPLY SEARCH + STATUS FILTER
  // ==========================================================

  applyFilters(): void {

    let result = [...this.categories];

    // --------------------------------------------------------
    // SEARCH BY CATEGORY NAME
    // --------------------------------------------------------

    if (this.searchTerm.trim()) {

      const searchValue =
        this.searchTerm.trim().toLowerCase();

      result = result.filter(category =>
        category.categoryName
          ?.toLowerCase()
          .includes(searchValue)
      );
    }

    // --------------------------------------------------------
    // FILTER BY STATUS
    // --------------------------------------------------------

    if (this.selectedStatus !== 'ALL') {

      result = result.filter(category =>
        category.status === this.selectedStatus
      );
    }

    this.filteredCategories = result;
  }

  // ==========================================================
  // GET CATEGORY BY ID
  // ==========================================================

  viewCategory(categoryId: number): void {

    this.leadCategoryService
      .getCategoryById(categoryId)
      .subscribe({

        next: (category) => {

          console.log(
            'Category:',
            category
          );

        },

        error: (error) => {

          console.error(
            'Error loading category:',
            error
          );

          this.errorMessage =
            'Unable to load category details.';
        }

      });
  }

  // ==========================================================
  // EDIT CATEGORY
  // ==========================================================

  editCategory(categoryId: number): void {

    this.router.navigate([
      '/admin/lead-configuration/category/edit',
      categoryId
    ]);
  }

  // ==========================================================
  // ADD CATEGORY
  // ==========================================================

  addCategory(): void {

    this.router.navigate([
      '/admin/lead-configuration/category/add'
    ]);
  }

  // ==========================================================
  // TOGGLE STATUS
  // ==========================================================

  /**
   * Toggles a category between ACTIVE and INACTIVE.
   *
   * This method is used directly by the HTML:
   *
   * (click)="toggleStatus(category)"
   */
  toggleStatus(category: LeadCategoryResponse): void {

    if (!category.categoryId) {
      return;
    }

    this.clearMessages();

    // --------------------------------------------------------
    // ACTIVE -> INACTIVE
    // --------------------------------------------------------

    if (category.status === LeadCategoryStatus.ACTIVE) {

      this.deactivateCategory(category);

    }

    // --------------------------------------------------------
    // INACTIVE -> ACTIVE
    // --------------------------------------------------------

    else {

      this.activateCategory(category);

    }
  }

  // ==========================================================
  // ACTIVATE CATEGORY
  // ==========================================================

  activateCategory(category: LeadCategoryResponse): void {

    if (!category.categoryId) {
      return;
    }

    this.clearMessages();

    this.leadCategoryService
      .activateCategory(category.categoryId)
      .subscribe({

        next: (updatedCategory) => {

          this.updateCategoryInList(
            updatedCategory
          );

          this.successMessage =
            'Category activated successfully.';
        },

        error: (error) => {

          console.error(
            'Error activating category:',
            error
          );

          this.errorMessage =
            'Unable to activate category.';
        }

      });
  }

  // ==========================================================
  // DEACTIVATE CATEGORY
  // ==========================================================

  deactivateCategory(category: LeadCategoryResponse): void {

    if (!category.categoryId) {
      return;
    }

    this.clearMessages();

    this.leadCategoryService
      .deactivateCategory(category.categoryId)
      .subscribe({

        next: (updatedCategory) => {

          this.updateCategoryInList(
            updatedCategory
          );

          this.successMessage =
            'Category deactivated successfully.';
        },

        error: (error) => {

          console.error(
            'Error deactivating category:',
            error
          );

          this.errorMessage =
            'Unable to deactivate category.';
        }

      });
  }

  // ==========================================================
  // UPDATE CATEGORY IN LOCAL LIST
  // ==========================================================

  private updateCategoryInList(
    updatedCategory: LeadCategoryResponse
  ): void {

    const index = this.categories.findIndex(
      category =>
        category.categoryId ===
        updatedCategory.categoryId
    );

    if (index !== -1) {

      this.categories[index] =
        updatedCategory;

      /*
       * Create a new array reference so Angular
       * updates the UI immediately.
       */
      this.categories = [
        ...this.categories
      ];

      this.applyFilters();
    }
  }

  // ==========================================================
  // REFRESH
  // ==========================================================

  refreshCategories(): void {

    this.clearMessages();

    this.loadCategories();
  }

  // ==========================================================
  // ACTIVE CATEGORY COUNT
  // ==========================================================

  getActiveCount(): number {

    return this.categories.filter(
      category =>
        category.status ===
        LeadCategoryStatus.ACTIVE
    ).length;
  }

  // ==========================================================
  // INACTIVE CATEGORY COUNT
  // ==========================================================

  getInactiveCount(): number {

    return this.categories.filter(
      category =>
        category.status ===
        LeadCategoryStatus.INACTIVE
    ).length;
  }

  // ==========================================================
  // TOTAL CATEGORY COUNT
  // ==========================================================

  getTotalCount(): number {

    return this.categories.length;
  }

  // ==========================================================
  // ALTERNATIVE GETTERS
  // ==========================================================

  /**
   * These can also be used in HTML if required:
   *
   * {{ activeCategoryCount }}
   * {{ inactiveCategoryCount }}
   */

  get activeCategoryCount(): number {

    return this.getActiveCount();
  }

  get inactiveCategoryCount(): number {

    return this.getInactiveCount();
  }

  // ==========================================================
  // CLEAR MESSAGES
  // ==========================================================

  private clearMessages(): void {

    this.errorMessage = '';

    this.successMessage = '';
  }

  // ==========================================================
  // TRACK BY
  // ==========================================================

  trackByCategoryId(
    index: number,
    category: LeadCategoryResponse
  ): number {

    return category.categoryId;
  }

}