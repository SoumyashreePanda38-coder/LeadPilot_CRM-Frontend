import { LeadCategoryStatus } from './lead-category-status.enum';

export interface LeadCategoryRequest {

  categoryName: string;

  description?: string;

  displayOrder?: number;

  status: LeadCategoryStatus;
}