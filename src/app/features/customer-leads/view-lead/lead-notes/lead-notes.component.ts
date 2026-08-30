
import { Component, Input, OnInit } from '@angular/core';

import { LeadNotesService } from 'src/app/core/services/lead-notes.service';
import { NoteRequest } from 'src/app/core/models/note-request';
import { NoteResponse } from 'src/app/core/models/note-response';

@Component({
  selector: 'app-lead-notes',
  templateUrl: './lead-notes.component.html',
  styleUrls: ['./lead-notes.component.css']
})
export class LeadNotesComponent implements OnInit {

  // ==========================================================
  // Lead ID
  // ==========================================================

  @Input() leadId!: number;


  // ==========================================================
  // Notes
  // ==========================================================

  notes: NoteResponse[] = [];

  filteredNotes: NoteResponse[] = [];


  // ==========================================================
  // Loading / Messages
  // ==========================================================

  isLoading = false;

  isSaving = false;

  successMessage = '';

  errorMessage = '';


  // ==========================================================
  // Add / Edit Note
  // ==========================================================

  showNoteForm = false;

  isEditMode = false;

  editingNoteId: number | null = null;


  // ==========================================================
  // Note Form
  // ==========================================================

  noteForm: NoteRequest = {
    leadId: 0,
    title: '',
    content: '',
    pinned: false,
    important: false
  };


  // ==========================================================
  // Search
  // ==========================================================

  searchKeyword = '';


  // ==========================================================
  // Filters
  // ==========================================================

  selectedFilter = 'ALL';


  // ==========================================================
  // Constructor
  // ==========================================================

  constructor(
    private leadNotesService: LeadNotesService
  ) {}


  // ==========================================================
  // On Init
  // ==========================================================

  ngOnInit(): void {

    if (this.leadId) {

      this.noteForm.leadId = this.leadId;

      this.loadNotes();
    }
  }


  // ==========================================================
  // Load Notes
  // ==========================================================

  loadNotes(): void {

    if (!this.leadId) {
      return;
    }

    this.isLoading = true;

    this.errorMessage = '';

    this.leadNotesService
      .getNotesByLead(this.leadId)
      .subscribe({

        next: (data: NoteResponse[]) => {

          this.notes = data || [];

          this.applyFilters();

          this.isLoading = false;
        },

        error: (error) => {

          console.error(
            'Error loading lead notes:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to load notes. Please try again.';

          this.isLoading = false;
        }
      });
  }


  // ==========================================================
  // Apply Search + Filters
  // ==========================================================

  applyFilters(): void {

    const keyword =
      this.searchKeyword
        .trim()
        .toLowerCase();

    this.filteredNotes =
      this.notes.filter((note) => {

        const matchesSearch =
          !keyword ||
          this.safeString(note.title)
            .includes(keyword) ||
          this.safeString(note.content)
            .includes(keyword) ||
          this.safeString(note.createdByName)
            .includes(keyword);

        let matchesFilter = true;

        switch (this.selectedFilter) {

          case 'PINNED':

            matchesFilter =
              note.pinned === true;

            break;

          case 'IMPORTANT':

            matchesFilter =
              note.important === true;

            break;

          case 'NORMAL':

            matchesFilter =
              !note.pinned &&
              !note.important;

            break;

          default:

            matchesFilter = true;

            break;
        }

        return (
          matchesSearch &&
          matchesFilter
        );
      });
  }


  // ==========================================================
  // Search
  // ==========================================================

  onSearch(): void {

    this.applyFilters();
  }


  // ==========================================================
  // Filter Change
  // ==========================================================

  onFilterChange(): void {

    this.applyFilters();
  }


  // ==========================================================
  // Clear Search
  // ==========================================================

  clearSearch(): void {

    this.searchKeyword = '';

    this.applyFilters();
  }


  // ==========================================================
  // Clear Filters
  // ==========================================================

  clearFilters(): void {

    this.searchKeyword = '';

    this.selectedFilter = 'ALL';

    this.applyFilters();
  }


  // ==========================================================
  // Open Add Note Form
  // ==========================================================

  openAddNote(): void {

    this.isEditMode = false;

    this.editingNoteId = null;

    this.resetForm();

    this.showNoteForm = true;
  }


  // ==========================================================
  // Open Edit Note Form
  // ==========================================================

  openEditNote(note: NoteResponse): void {

    this.isEditMode = true;

    this.editingNoteId = note.noteId;

    this.noteForm = {

      leadId: this.leadId,

      title: note.title,

      content: note.content,

      pinned: note.pinned,

      important: note.important
    };

    this.showNoteForm = true;

    this.clearMessages();
  }


  // ==========================================================
  // Close Note Form
  // ==========================================================

  closeNoteForm(): void {

    this.showNoteForm = false;

    this.isEditMode = false;

    this.editingNoteId = null;

    this.resetForm();
  }


  // ==========================================================
  // Save Note
  // ==========================================================

  saveNote(): void {

    this.clearMessages();

    if (!this.noteForm.title.trim()) {

      this.errorMessage =
        'Please enter a note title.';

      return;
    }

    if (!this.noteForm.content.trim()) {

      this.errorMessage =
        'Please enter note content.';

      return;
    }

    this.noteForm.leadId =
      this.leadId;

    this.isSaving = true;


    // --------------------------------------------------------
    // UPDATE
    // --------------------------------------------------------

    if (
      this.isEditMode &&
      this.editingNoteId !== null
    ) {

      /*
       * Replace this with your actual logged-in
       * user ID when authentication integration
       * is connected.
       */

      const updatedById =
        this.getCurrentUserId();

      this.leadNotesService
        .updateNote(
          this.editingNoteId,
          this.noteForm,
          updatedById
        )
        .subscribe({

          next: () => {

            this.successMessage =
              'Note updated successfully.';

            this.closeNoteForm();

            this.loadNotes();

            this.hideSuccessMessage();
          },

          error: (error) => {

            console.error(
              'Error updating note:',
              error
            );

            this.errorMessage =
              error?.error?.message ||
              'Unable to update note. Please try again.';

            this.isSaving = false;
          }
        });

      return;
    }


    // --------------------------------------------------------
    // CREATE
    // --------------------------------------------------------

    const createdById =
      this.getCurrentUserId();

    this.leadNotesService
      .createNote(
        this.noteForm,
        createdById
      )
      .subscribe({

        next: () => {

          this.successMessage =
            'Note added successfully.';

          this.closeNoteForm();

          this.loadNotes();

          this.hideSuccessMessage();
        },

        error: (error) => {

          console.error(
            'Error creating note:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to create note. Please try again.';

          this.isSaving = false;
        }
      });
  }


  // ==========================================================
  // Delete Note
  // ==========================================================

  deleteNote(note: NoteResponse): void {

    const confirmed =
      window.confirm(
        `Are you sure you want to delete "${note.title}"?`
      );

    if (!confirmed) {
      return;
    }

    const deletedById =
      this.getCurrentUserId();

    this.isLoading = true;

    this.leadNotesService
      .deleteNote(
        note.noteId,
        deletedById
      )
      .subscribe({

        next: () => {

          this.successMessage =
            'Note deleted successfully.';

          this.loadNotes();

          this.hideSuccessMessage();
        },

        error: (error) => {

          console.error(
            'Error deleting note:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to delete note. Please try again.';

          this.isLoading = false;
        }
      });
  }


  // ==========================================================
  // Restore Note
  // ==========================================================

  restoreNote(note: NoteResponse): void {

    this.isLoading = true;

    this.leadNotesService
      .restoreNote(note.noteId)
      .subscribe({

        next: () => {

          this.successMessage =
            'Note restored successfully.';

          this.loadNotes();

          this.hideSuccessMessage();
        },

        error: (error) => {

          console.error(
            'Error restoring note:',
            error
          );

          this.errorMessage =
            error?.error?.message ||
            'Unable to restore note. Please try again.';

          this.isLoading = false;
        }
      });
  }


  // ==========================================================
  // Toggle Pin
  // ==========================================================

  togglePin(note: NoteResponse): void {

    const request =
      note.pinned
        ? this.leadNotesService.unpinNote(note.noteId)
        : this.leadNotesService.pinNote(note.noteId);

    request.subscribe({

      next: () => {

        note.pinned =
          !note.pinned;

        this.applyFilters();
      },

      error: (error) => {

        console.error(
          'Error changing pin status:',
          error
        );

        this.errorMessage =
          error?.error?.message ||
          'Unable to update pin status.';
      }
    });
  }


  // ==========================================================
  // Toggle Important
  // ==========================================================

  toggleImportant(note: NoteResponse): void {

    const request =
      note.important
        ? this.leadNotesService.markNotImportant(
            note.noteId
          )
        : this.leadNotesService.markImportant(
            note.noteId
          );

    request.subscribe({

      next: () => {

        note.important =
          !note.important;

        this.applyFilters();
      },

      error: (error) => {

        console.error(
          'Error changing important status:',
          error
        );

        this.errorMessage =
          error?.error?.message ||
          'Unable to update important status.';
      }
    });
  }


  // ==========================================================
  // Counts
  // ==========================================================

  getTotalCount(): number {

    return this.notes.length;
  }


  getPinnedCount(): number {

    return this.notes.filter(
      note => note.pinned
    ).length;
  }


  getImportantCount(): number {

    return this.notes.filter(
      note => note.important
    ).length;
  }


  getNormalCount(): number {

    return this.notes.filter(
      note =>
        !note.pinned &&
        !note.important
    ).length;
  }


  // ==========================================================
  // Reset Form
  // ==========================================================

  private resetForm(): void {

    this.noteForm = {

      leadId: this.leadId,

      title: '',

      content: '',

      pinned: false,

      important: false
    };

    this.isSaving = false;
  }


  // ==========================================================
  // Clear Messages
  // ==========================================================

  private clearMessages(): void {

    this.successMessage = '';

    this.errorMessage = '';
  }


  // ==========================================================
  // Hide Success Message
  // ==========================================================

  private hideSuccessMessage(): void {

    setTimeout(() => {

      this.successMessage = '';

    }, 4000);
  }


  // ==========================================================
  // Safe String
  // ==========================================================

  private safeString(value: any): string {

    if (
      value === null ||
      value === undefined
    ) {
      return '';
    }

    return String(value).toLowerCase();
  }


  // ==========================================================
  // Current User ID
  // ==========================================================
  //
  // IMPORTANT:
  // Connect this method to your AuthService once the
  // logged-in user's ID is available there.
  //
  // ==========================================================

  private getCurrentUserId(): number {

    const storedUser =
      localStorage.getItem('user');

    if (storedUser) {

      try {

        const user =
          JSON.parse(storedUser);

        if (user?.id) {
          return Number(user.id);
        }

        if (user?.userId) {
          return Number(user.userId);
        }

      } catch (error) {

        console.error(
          'Unable to read logged-in user:',
          error
        );
      }
    }

    /*
     * Temporary fallback.
     * Replace with your AuthService implementation.
     */

    return 1;
  }

}
