import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { NoteService } from './note.service';
import { Note } from './note.model';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
  standalone: false
})
export class NotesPage {
  readonly folderId = this.route.snapshot.paramMap.get('folderId') ?? '';
  readonly notes$ = this.noteService.forFolder(this.folderId);
  searchTerm = '';
  newNoteTitle = '';
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly noteService: NoteService
  ) {}

  filterNotes(notes: Note[]) {
    const search = this.searchTerm.trim().toLocaleLowerCase();

    if (!search) {
      return notes;
    }

    return notes.filter((note) => note.title.toLocaleLowerCase().includes(search));
  }

  async createNote() {
    this.errorMessage = '';

    try {
      await this.noteService.create(this.folderId, this.newNoteTitle);
      this.newNoteTitle = '';
    } catch {
      this.errorMessage = 'Escribe un título válido para la nota.';
    }
  }

  openNote(noteId: string) {
    return this.router.navigate(['/notes', this.folderId, noteId]);
  }

  async deleteNote(noteId: string, title: string) {
    if (!window.confirm(`¿Eliminar la nota "${title}"?`)) {
      return;
    }

    try {
      await this.noteService.delete(noteId);
    } catch {
      this.errorMessage = 'No se pudo eliminar la nota.';
    }
  }

  backToFolders() {
    return this.router.navigateByUrl('/home');
  }
}
