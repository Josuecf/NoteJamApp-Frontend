import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';

import { FolderService } from '../../../folders/services/folder.service';
import { Note } from '../../models/note.model';
import { NoteService } from '../../services/note.service';
import { FloatingSearchActionComponent } from '../../../../shared/components/floating-search-action/floating-search-action.component';
import { AnimatedPageTitleComponent } from '../../../../shared/components/animated-page-title/animated-page-title.component';

interface NoteGroup {
  label: string;
  notes: Note[];
}

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
  standalone: false
})
export class NotesPage {
  @ViewChild(FloatingSearchActionComponent) notesSearch?: FloatingSearchActionComponent;
  @ViewChild(AnimatedPageTitleComponent) pageTitle?: AnimatedPageTitleComponent;
  readonly folderId = this.route.snapshot.paramMap.get('folderId') ?? '';
  readonly notes$ = this.noteService.forFolder(this.folderId);
  readonly folder$ = this.folderService.watch(this.folderId);
  searchTerm = '';
  isHeaderCollapsed = false;
  isDeleting = false;
  pendingDelete: { id: string; title: string } | null = null;
  errorMessage = '';
  private groupedSource?: Note[];
  private groupedSearch = '';
  private groupedResult: NoteGroup[] = [];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly noteService: NoteService,
    private readonly folderService: FolderService,
    private readonly actionSheetController: ActionSheetController,
  ) {}

  filterNotes(notes: Note[]) {
    const search = this.searchTerm.trim().toLocaleLowerCase();

    if (!search) {
      return notes;
    }

    return notes.filter((note) => note.title.toLocaleLowerCase().includes(search));
  }

  noteCountLabel(count: number) {
    if (count === 0) {
      return 'Sin notas';
    }

    return `${count} ${count === 1 ? 'nota' : 'notas'}`;
  }

  groupedNotes(notes: Note[]): NoteGroup[] {
    const search = this.searchTerm.trim().toLocaleLowerCase();

    if (this.groupedSource === notes && this.groupedSearch === search) {
      return this.groupedResult;
    }

    const filteredNotes = search
      ? notes.filter((note) => note.title.toLocaleLowerCase().includes(search))
      : notes;
    const groups = new Map<string, NoteGroup>();

    for (const note of filteredNotes) {
      const label = this.noteGroupLabel(note);
      const group = groups.get(label);

      if (group) {
        group.notes.push(note);
      } else {
        groups.set(label, { label, notes: [note] });
      }
    }

    this.groupedSource = notes;
    this.groupedSearch = search;
    this.groupedResult = [...groups.values()];
    return this.groupedResult;
  }

  handleScroll(event: Event) {
    this.pageTitle?.handleScroll(event);
  }

  handleGestureStart(event: TouchEvent) {
    this.pageTitle?.handleGestureStart(event);
  }

  handleGestureMove(event: TouchEvent) {
    this.pageTitle?.handleGestureMove(event);
  }

  handleGestureEnd(event: TouchEvent) {
    void this.pageTitle?.handleGestureEnd(event);
  }

  handleGestureCancel() {
    this.pageTitle?.handleGestureCancel();
  }

  toggleCreateForm() {
    void this.router.navigate(['/notes', this.folderId, 'new']);
  }

  focusSearch() {
    this.notesSearch?.focus();
  }

  notePreview(content: string) {
    const preview = content.replace(/\s+/g, ' ').trim();
    return preview || 'Sin contenido todavía';
  }

  formatUpdatedAt(note: Note) {
    const date = note.updatedAt?.toDate?.();

    if (!date) {
      return 'Guardando…';
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const noteDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const dayDifference = Math.round((today.getTime() - noteDay.getTime()) / 86400000);

    if (dayDifference === 0) {
      const formatted = new Intl.DateTimeFormat('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      }).format(date);

      return formatted.replace('AM', 'a.m').replace('PM', 'p.m');
    }

    const startOfWeek = new Date(today);
    const dayOfWeek = (today.getDay() + 6) % 7;
    startOfWeek.setDate(today.getDate() - dayOfWeek);
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    if (date >= startOfWeek && date <= endOfWeek) {
      return String(date.getDate());
    }

    return new Intl.DateTimeFormat('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: '2-digit'
    }).format(date);
  }

  private noteGroupLabel(note: Note) {
    const date = note.updatedAt?.toDate?.();

    if (!date) {
      return 'Recientes';
    }

    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const noteDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const daysAgo = Math.floor((today.getTime() - noteDay.getTime()) / 86400000);

    if (daysAgo >= 0 && daysAgo < 7) {
      return 'Últimos 7 días';
    }

    if (daysAgo >= 0 && daysAgo < 30) {
      return 'Últimos 30 días';
    }

    if (date.getFullYear() === now.getFullYear()) {
      const month = new Intl.DateTimeFormat('es-PE', { month: 'long' }).format(date);
      return month.charAt(0).toLocaleUpperCase() + month.slice(1);
    }

    return String(date.getFullYear());
  }

  openNote(noteId: string) {
    return this.router.navigate(['/notes', this.folderId, noteId]);
  }

  deleteNote(noteId: string, title: string) {
    this.pendingDelete = { id: noteId, title };
  }

  cancelNoteDelete() {
    this.pendingDelete = null;
  }

  confirmNoteDelete() {
    const note = this.pendingDelete;

    if (note) {
      this.isDeleting = true;
      void this.performNoteDelete(note.id);
    }
  }

  async openNoteOptions(note: Note) {
    const sheet = await this.actionSheetController.create({
      header: note.title,
      buttons: [
        {
          text: 'Editar',
          icon: 'pencil-outline',
          handler: () => void this.openNote(note.id)
        },
        {
          text: 'Eliminar',
          icon: 'trash-outline',
          role: 'destructive',
          handler: () => void this.deleteNote(note.id, note.title)
        },
        { text: 'Cancelar', role: 'cancel' }
      ]
    });
    await sheet.present();
  }

  private async performNoteDelete(noteId: string) {
    try {
      await this.noteService.delete(noteId);
    } catch {
      this.errorMessage = 'No se pudo eliminar la nota.';
    } finally {
      this.isDeleting = false;
      this.pendingDelete = null;
    }
  }

  backToFolders() {
    if (window.history.length > 1) {
      window.history.back();
      return;
    }

    return this.router.navigateByUrl('/home');
  }

  openSettings() {
    return this.router.navigateByUrl('/settings');
  }
}
