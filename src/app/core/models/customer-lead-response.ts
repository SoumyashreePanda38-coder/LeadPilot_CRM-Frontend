import { LeadStatus } from './lead-status.enum';
import { LeadPriority } from './lead-priority.enum';

export interface CustomerLeadResponse {

  // ==========================================================
  // Primary Key
  // ==========================================================

  leadId: number;

  // ==========================================================
  // Customer / Lead Personal Information
  // ==========================================================

  fullName: string;
  age?: number;

  // ==========================================================
  // Contact Information
  // ==========================================================

  email?: string;
  phoneNumber: string;

  // ==========================================================
  // Address Information
  // ==========================================================

  address?: string;
  city?: string;
  state?: string;
  pincode?: string;

  // ==========================================================
  // Category
  // ==========================================================

  categoryId: number;
  categoryName: string;

  // ==========================================================
  // Subcategory
  // ==========================================================

  subCategoryId: number;
  subCategoryName: string;

  // ==========================================================
  // Lead Source
  // ==========================================================

  leadSourceId: number;
  sourceName: string;

  // ==========================================================
  // Lead Status
  // ==========================================================

  leadStatus: LeadStatus;

  // ==========================================================
  // Lead Priority
  // ==========================================================

  leadPriority: LeadPriority;

  // ==========================================================
  // Assigned Executive
  // ==========================================================

  assignedUserId?: number;
  assignedUserName?: string;

  // ==========================================================
  // Audit Information
  // ==========================================================

  createdById?: number;
  createdByName?: string;

  updatedById?: number;
  updatedByName?: string;

  createdAt: string;
  updatedAt: string;
}