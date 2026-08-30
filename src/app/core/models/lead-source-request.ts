import { LeadCategoryStatus } from './lead-category-status.enum';

export interface LeadSourceRequest {

  sourceName: string;

  description?: string;

  displayOrder?: number;

  status: LeadCategoryStatus;

}