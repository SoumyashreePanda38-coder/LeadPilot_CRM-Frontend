import { LeadActivityType } from './lead-activity-type.enum';

export interface LeadActivityResponse {

  // Activity ID
  activityId: number;

  // Activity Type
  activityType: LeadActivityType;

  // Activity Description
  description?: string;

  // Activity Created Date/Time
  createdAt: string;

  // Lead Information
  leadId: number;
  leadName?: string;

  // User Information
  performedById?: number;
  performedByName?: string;
}