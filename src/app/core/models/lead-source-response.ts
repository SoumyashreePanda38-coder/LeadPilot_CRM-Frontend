import { LeadCategoryStatus } from './lead-category-status.enum';

export interface LeadSourceResponse {

  // ==========================================================
  // Primary Key
  // ==========================================================

  leadSourceId: number;


  // ==========================================================
  // Source Information
  // ==========================================================

  sourceName: string;

  description?: string;

  displayOrder?: number;


  // ==========================================================
  // Status
  // ==========================================================

  status: LeadCategoryStatus;


  // ==========================================================
  // Audit Information
  // ==========================================================

  createdById?: number;

  createdByName?: string;

  updatedById?: number;

  updatedByName?: string;

  createdAt?: string;

  updatedAt?: string;

}