import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LeadSourceService } from '../../../../core/services/lead-source.service';
import { LeadSourceResponse } from '../../../../core/models/lead-source-response';
import { LeadCategoryStatus } from '../../../../core/models/lead-category-status.enum';

@Component({
  selector: 'app-source-list',
  templateUrl: './source-list.component.html',
  styleUrls: ['./source-list.component.css']
})
export class SourceListComponent implements OnInit {

  // ==========================================================
  // DATA
  // ==========================================================

  leadSources: LeadSourceResponse[] = [];
  filteredSources: LeadSourceResponse[] = [];

  // ==========================================================
  // UI STATE
  // ==========================================================

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  searchKeyword = '';

  selectedStatus: LeadCategoryStatus | 'ALL' = 'ALL';

  // Make enum available to HTML
  LeadCategoryStatus = LeadCategoryStatus;

  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor(
    private leadSourceService: LeadSourceService,
    private router: Router
  ) {}

  // ==========================================================
  // INITIALIZATION
  // ==========================================================

  ngOnInit(): void {
    this.loadLeadSources();
  }

  // ==========================================================
  // LOAD ALL LEAD SOURCES
  // ==========================================================

  loadLeadSources(): void {

    this.isLoading = true;
    this.errorMessage = '';

    this.leadSourceService.getAllLeadSources().subscribe({

      next: (response: LeadSourceResponse[]) => {

        this.leadSources = response;

        this.applyFilters();

        this.isLoading = false;
      },

      error: (error) => {

        console.error('Error loading lead sources:', error);

        this.errorMessage =
          error?.error?.message ||
          'Failed to load lead sources. Please try again.';

        this.isLoading = false;
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
  // STATUS FILTER
  // ==========================================================

  onStatusChange(): void {
    this.applyFilters();
  }

  // ==========================================================
  // APPLY SEARCH + STATUS FILTER
  // ==========================================================

  applyFilters(): void {

    let result = [...this.leadSources];

    // --------------------------------------------------------
    // SEARCH FILTER
    // --------------------------------------------------------

    if (this.searchKeyword.trim()) {

      const keyword =
        this.searchKeyword.trim().toLowerCase();

      result = result.filter(source =>
        source.sourceName
          ?.toLowerCase()
          .includes(keyword) ||

        source.description
          ?.toLowerCase()
          .includes(keyword)
      );
    }

    // --------------------------------------------------------
    // STATUS FILTER
    // --------------------------------------------------------

    if (this.selectedStatus !== 'ALL') {

      result = result.filter(source =>
        source.status === this.selectedStatus
      );
    }

    this.filteredSources = result;
  }

  // ==========================================================
  // CLEAR SEARCH
  // ==========================================================

  clearSearch(): void {

    this.searchKeyword = '';

    this.applyFilters();
  }

  // ==========================================================
  // ACTIVATE SOURCE
  // ==========================================================

  activateSource(source: LeadSourceResponse): void {

    if (!source.leadSourceId) {
      return;
    }

    this.leadSourceService
      .activateLeadSource(source.leadSourceId)
      .subscribe({

        next: (response: LeadSourceResponse) => {

          this.successMessage =
            'Lead source activated successfully.';

          this.updateSourceInList(response);

          this.clearMessages();
        },

        error: (error) => {

          console.error(
            'Error activating lead source:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Failed to activate lead source.';

          this.clearMessages();
        }

      });
  }

  // ==========================================================
  // DEACTIVATE SOURCE
  // ==========================================================

  deactivateSource(source: LeadSourceResponse): void {

    if (!source.leadSourceId) {
      return;
    }

    this.leadSourceService
      .deactivateLeadSource(source.leadSourceId)
      .subscribe({

        next: (response: LeadSourceResponse) => {

          this.successMessage =
            'Lead source deactivated successfully.';

          this.updateSourceInList(response);

          this.clearMessages();
        },

        error: (error) => {

          console.error(
            'Error deactivating lead source:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Failed to deactivate lead source.';

          this.clearMessages();
        }

      });
  }

  // ==========================================================
  // DELETE SOURCE
  // ==========================================================

  deleteSource(source: LeadSourceResponse): void {

    if (!source.leadSourceId) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete "${source.sourceName}"?`
    );

    if (!confirmed) {
      return;
    }

    this.leadSourceService
      .deleteLeadSource(source.leadSourceId)
      .subscribe({

        next: () => {

          this.successMessage =
            'Lead source deleted successfully.';

          this.leadSources =
            this.leadSources.filter(
              item =>
                item.leadSourceId !== source.leadSourceId
            );

          this.applyFilters();

          this.clearMessages();
        },

        error: (error) => {

          console.error(
            'Error deleting lead source:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Failed to delete lead source.';

          this.clearMessages();
        }

      });
  }

  // ==========================================================
  // UPDATE SOURCE IN LOCAL LIST
  // ==========================================================

  private updateSourceInList(
    updatedSource: LeadSourceResponse
  ): void {

    const index = this.leadSources.findIndex(
      source =>
        source.leadSourceId ===
        updatedSource.leadSourceId
    );

    if (index !== -1) {

      this.leadSources[index] = updatedSource;

      this.leadSources = [...this.leadSources];

      this.applyFilters();
    }
  }
//edit
editSource(sourceId: number): void {

  if (!sourceId) {
    return;
  }

  this.router.navigate([
    '/admin/lead-configuration/source/edit',
    sourceId
  ]);

}
  // ==========================================================
  // STATUS CHECK
  // ==========================================================

  isActive(source: LeadSourceResponse): boolean {

    return source.status ===
      LeadCategoryStatus.ACTIVE;
  }

  isInactive(source: LeadSourceResponse): boolean {

    return source.status ===
      LeadCategoryStatus.INACTIVE;
  }

  // ==========================================================
  // COUNTS
  // ==========================================================

  getTotalCount(): number {
    return this.leadSources.length;
  }

  getActiveCount(): number {

    return this.leadSources.filter(
      source =>
        source.status === LeadCategoryStatus.ACTIVE
    ).length;
  }

  getInactiveCount(): number {

    return this.leadSources.filter(
      source =>
        source.status === LeadCategoryStatus.INACTIVE
    ).length;
  }

  // ==========================================================
  // MESSAGE HANDLING
  // ==========================================================

  private clearMessages(): void {

    setTimeout(() => {

      this.successMessage = '';
      this.errorMessage = '';

    }, 3000);
  }

}