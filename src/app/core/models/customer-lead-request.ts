import { LeadStatus } from './lead-status.enum';
import { LeadPriority } from './lead-priority.enum';

export interface CustomerLeadRequest {

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
  // Category / Subcategory / Source
  // ==========================================================

  categoryId: number;
  subCategoryId: number;
  leadSourceId: number;

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
}