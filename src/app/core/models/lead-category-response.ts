import { LeadCategoryStatus } from './lead-category-status.enum';

export interface LeadCategoryResponse {

  // Primary Key
  categoryId: number;

  // Category Information
  categoryName: string;

  description?: string;

  displayOrder?: number;

  // Category Status
  status: LeadCategoryStatus;

  // Audit Information
  createdById?: number;

  createdByName?: string;

  updatedById?: number;

  updatedByName?: string;

  createdAt?: string;

  updatedAt?: string;
}