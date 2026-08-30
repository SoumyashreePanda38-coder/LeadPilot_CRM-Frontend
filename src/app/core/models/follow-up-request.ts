import { FollowUpStatus } from './follow-up-status.enum';
import { FollowUpType } from './follow-up-type.enum';

export interface FollowUpRequest {
  leadId: number;
  assignedUserId: number;
  followUpType: FollowUpType;
  subject?: string;
  scheduledAt: string;
  location?: string;
  description?: string;
  status?: FollowUpStatus;
  completedAt?: string | null;
  outcome?: string;
}
