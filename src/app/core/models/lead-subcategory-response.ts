import { LeadCategoryStatus } from './lead-category-status.enum';

export interface LeadSubCategoryResponse {

  // ==========================================================
  // Primary Key
  // ==========================================================

  subCategoryId: number;

  // ==========================================================
  // Parent Category
  // ==========================================================

  categoryId: number;

  categoryName: string;

  // ==========================================================
  // Subcategory Information
  // ==========================================================

  subCategoryName: string;

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