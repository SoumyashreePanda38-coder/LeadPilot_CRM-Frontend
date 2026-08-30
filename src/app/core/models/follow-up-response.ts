import { FollowUpStatus } from './follow-up-status.enum';
import { FollowUpType } from './follow-up-type.enum';

export interface FollowUpResponse {
  followUpId: number;
  leadId: number;
  leadName?: string;
  assignedUserId: number;
  assignedUserName?: string;
  followUpType: FollowUpType;
  subject?: string;
  scheduledAt: string;
  location?: string;
  description?: string;
  status: FollowUpStatus;
  outcome?: string;
  completedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
  version?: number;
}
