import { LeadActivityType } from './lead-activity-type.enum';

export interface LeadActivityRequest {

  // Customer Lead
  leadId: number;

  // Activity Type
  activityType: LeadActivityType;

  // Activity Description
  description?: string;

  // User who performed the activity
  performedById?: number;
}