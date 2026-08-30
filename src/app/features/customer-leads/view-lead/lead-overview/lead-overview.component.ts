import {
  Component,
  Input
} from '@angular/core';

import { CustomerLeadResponse } from 'src/app/core/models/customer-lead-response';

@Component({
  selector: 'app-lead-overview',
  templateUrl: './lead-overview.component.html',
  styleUrls: ['./lead-overview.component.css']
})
export class LeadOverviewComponent {

  // ==========================================================
  // INPUT
  // ==========================================================

  /**
   * Complete lead information received from
   * ViewLeadComponent.
   *
   * ViewLeadComponent is responsible for loading
   * the lead from the backend.
   */
  @Input() lead: CustomerLeadResponse | null = null;


  // ==========================================================
  // UI STATE
  // ==========================================================

  loading = false;

  errorMessage = '';


  // ==========================================================
  // CONSTRUCTOR
  // ==========================================================

  constructor() {}


  // ==========================================================
  // REFRESH
  // ==========================================================

  /**
   * Refresh hook.
   *
   * The actual lead data is controlled by ViewLeadComponent,
   * so no API call is required here.
   */
  refresh(): void {

    // Intentionally empty.
    // ViewLeadComponent owns the lead data.
  }


  // ==========================================================
  // DISPLAY HELPERS
  // ==========================================================

  /**
   * Returns a CSS class based on the lead status.
   */
  getStatusClass(): string {

    if (!this.lead) {
      return '';
    }

    /*
     * CustomerLeadResponse may use either:
     * leadStatus or status depending on the DTO/model.
     */

    const status =
      (this.lead as any).leadStatus ??
      (this.lead as any).status;

    if (!status) {
      return '';
    }

    return status
      .toString()
      .toLowerCase()
      .replace(/_/g, '-')
      .replace(/\s+/g, '-');
  }


  /**
   * Returns a CSS class based on the lead priority.
   */
  getPriorityClass(): string {

    if (!this.lead) {
      return '';
    }

    /*
     * CustomerLeadResponse may use either:
     * leadPriority or priority depending on the DTO/model.
     */

    const priority =
      (this.lead as any).leadPriority ??
      (this.lead as any).priority;

    if (!priority) {
      return '';
    }

    return priority
      .toString()
      .toLowerCase()
      .replace(/_/g, '-')
      .replace(/\s+/g, '-');
  }


  // ==========================================================
  // ENUM FORMATTER
  // ==========================================================

  /**
   * Converts enum values such as:
   *
   * HOT
   * IN_PROGRESS
   * NOT_INTERESTED
   *
   * into:
   *
   * Hot
   * In Progress
   * Not Interested
   */
  formatEnum(
    value: string | null | undefined
  ): string {

    if (!value) {
      return '-';
    }

    return value
      .toString()
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, char =>
        char.toUpperCase()
      );
  }


  // ==========================================================
  // DATE FORMATTER
  // ==========================================================

  formatDate(
    date: string | Date | null | undefined
  ): string {

    if (!date) {
      return '-';
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return '-';
    }

    return parsedDate.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }
    );
  }


  // ==========================================================
  // DATE + TIME FORMATTER
  // ==========================================================

  formatDateTime(
    date: string | Date | null | undefined
  ): string {

    if (!date) {
      return '-';
    }

    const parsedDate = new Date(date);

    if (isNaN(parsedDate.getTime())) {
      return '-';
    }

    return parsedDate.toLocaleString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    );
  }


  // ==========================================================
  // NULL / EMPTY VALUE HELPER
  // ==========================================================

  displayValue(
    value: string | number | null | undefined
  ): string {

    if (
      value === null ||
      value === undefined ||
      value === ''
    ) {
      return '-';
    }

    return value.toString();
  }


  // ==========================================================
  // BOOLEAN DISPLAY
  // ==========================================================

  displayBoolean(
    value: boolean | null | undefined
  ): string {

    if (
      value === null ||
      value === undefined
    ) {
      return '-';
    }

    return value ? 'Yes' : 'No';
  }


  // ==========================================================
  // LEAD NAME INITIAL
  // ==========================================================

  getLeadInitial(): string {

    if (!this.lead) {
      return '?';
    }

    const name =
      (this.lead as any).fullName ??
      (this.lead as any).customerName ??
      '';

    if (!name) {
      return '?';
    }

    return name
      .charAt(0)
      .toUpperCase();
  }

}