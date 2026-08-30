export enum LeadActivityType {

  // ==========================================================
  // Lead Creation & Basic Updates
  // ==========================================================

  LEAD_CREATED = 'LEAD_CREATED',
  LEAD_UPDATED = 'LEAD_UPDATED',

  // ==========================================================
  // Lead Assignment
  // ==========================================================

  LEAD_ASSIGNED = 'LEAD_ASSIGNED',
  LEAD_REASSIGNED = 'LEAD_REASSIGNED',
  LEAD_UNASSIGNED = 'LEAD_UNASSIGNED',

  // ==========================================================
  // Customer Communication
  // ==========================================================

  CALL = 'CALL',
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  WHATSAPP = 'WHATSAPP',

  // ==========================================================
  // Meetings & Personal Interaction
  // ==========================================================

  MEETING_SCHEDULED = 'MEETING_SCHEDULED',
  MEETING_COMPLETED = 'MEETING_COMPLETED',
  MEETING_CANCELLED = 'MEETING_CANCELLED',

  VISIT_SCHEDULED = 'VISIT_SCHEDULED',
  VISIT_COMPLETED = 'VISIT_COMPLETED',
  VISIT_CANCELLED = 'VISIT_CANCELLED',

  // ==========================================================
  // Lead Status Changes
  // ==========================================================

  STATUS_CHANGED = 'STATUS_CHANGED',

  // ==========================================================
  // Lead Priority Changes
  // ==========================================================

  PRIORITY_CHANGED = 'PRIORITY_CHANGED',

  // ==========================================================
  // Lead Classification Changes
  // ==========================================================

  CATEGORY_CHANGED = 'CATEGORY_CHANGED',
  SUBCATEGORY_CHANGED = 'SUBCATEGORY_CHANGED',
  SOURCE_CHANGED = 'SOURCE_CHANGED',

  // ==========================================================
  // Follow-Up Activities
  // ==========================================================

  FOLLOW_UP_CREATED = 'FOLLOW_UP_CREATED',
  FOLLOW_UP_UPDATED = 'FOLLOW_UP_UPDATED',
  FOLLOW_UP_COMPLETED = 'FOLLOW_UP_COMPLETED',
  FOLLOW_UP_RESCHEDULED = 'FOLLOW_UP_RESCHEDULED',
  FOLLOW_UP_CANCELLED = 'FOLLOW_UP_CANCELLED',
  FOLLOW_UP_MISSED = 'FOLLOW_UP_MISSED',

  // ==========================================================
  // Notes
  // ==========================================================

  NOTE_ADDED = 'NOTE_ADDED',
  NOTE_UPDATED = 'NOTE_UPDATED',
  NOTE_DELETED = 'NOTE_DELETED',

  // ==========================================================
  // Lead Conversion
  // ==========================================================

  LEAD_CONVERTED = 'LEAD_CONVERTED',

  // ==========================================================
  // Lead Closure
  // ==========================================================

  LEAD_CLOSED = 'LEAD_CLOSED',
  LEAD_REOPENED = 'LEAD_REOPENED',

  // ==========================================================
  // Customer / Lead Interest
  // ==========================================================

  INTERESTED = 'INTERESTED',
  NOT_INTERESTED = 'NOT_INTERESTED',

  // ==========================================================
  // Documents
  // ==========================================================

  DOCUMENT_ADDED = 'DOCUMENT_ADDED',
  DOCUMENT_UPDATED = 'DOCUMENT_UPDATED',
  DOCUMENT_REMOVED = 'DOCUMENT_REMOVED',

  // ==========================================================
  // Import / Export
  // ==========================================================

  LEAD_IMPORTED = 'LEAD_IMPORTED',
  LEAD_EXPORTED = 'LEAD_EXPORTED',

  // ==========================================================
  // System / Administrative Activities
  // ==========================================================

  LEAD_ARCHIVED = 'LEAD_ARCHIVED',
  LEAD_RESTORED = 'LEAD_RESTORED'
}