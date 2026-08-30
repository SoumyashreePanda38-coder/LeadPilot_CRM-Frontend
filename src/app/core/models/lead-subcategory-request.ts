import { LeadCategoryStatus } from './lead-category-status.enum';

export interface LeadSubCategoryRequest {

  categoryId: number;

  subCategoryName: string;

  description?: string;

  displayOrder?: number;

  status: LeadCategoryStatus;
}