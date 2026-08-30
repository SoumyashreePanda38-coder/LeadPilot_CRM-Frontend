
export interface NoteResponse {

  // ==========================================================
  // Primary Key
  // ==========================================================

  noteId: number;

  // ==========================================================
  // Customer Lead Information
  // ==========================================================

  leadId: number;

  leadName: string;

  // ==========================================================
  // Note Information
  // ==========================================================

  title: string;

  content: string;

  // ==========================================================
  // Note Flags
  // ==========================================================

  pinned: boolean;

  important: boolean;

  // ==========================================================
  // Created By Information
  // ==========================================================

  createdById: number;

  createdByName: string;

  // ==========================================================
  // Updated By Information
  // ==========================================================

  updatedById: number | null;

  updatedByName: string | null;

  // ==========================================================
  // Soft Delete Information
  // ==========================================================

  deleted: boolean;

  deletedAt: string | null;

  deletedById: number | null;

  deletedByName: string | null;

  // ==========================================================
  // Audit Information
  // ==========================================================

  createdAt: string;

  updatedAt: string;
}

