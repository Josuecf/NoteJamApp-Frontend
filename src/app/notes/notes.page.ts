import { Component, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, IonSearchbar } from '@ionic/angular';

import { NoteService } from './note.service';
import { Note } from './note.model';
import { FolderService } from '../folders/folder.service';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
  standalone: false
})
export class NotesPage {
  @ViewChild('notesSearch') notesSearch?: IonSearchbar;
  readonly folderId = this.route.snapshot.paramMap.get('folderId') ?? '';
  readonly notes$ = this.noteService.forFolder(this.folderId);
  readonly folder$ = this.folderService.watch(this.folderId);
  searchTerm = '';
  newNoteTitle = '';
  newNoteContent = '';
  isCreateFormVisible = false;
  errorMessage = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly noteService: NoteService,
    private readonly folderService: FolderService,
    private readonly actionSheetController: ActionSheetController,
    private readonly alertController: AlertController
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
      await this.noteService.create(this.folderId, this.newNoteTitle, this.newNoteContent);
      this.newNoteTitle = '';
      this.newNoteContent = '';
      this.isCreateFormVisible = false;
    } catch {
      this.errorMessage = 'Escribe un título válido para la nota.';
    }
  }

  toggleCreateForm() {
    this.isCreateFormVisible = !this.isCreateFormVisible;
    this.errorMessage = '';
  }

  closeCreateForm() {
    this.isCreateFormVisible = false;
    this.newNoteTitle = '';
    this.newNoteContent = '';
    this.errorMessage = '';
  }

  async focusSearch() {
    await this.notesSearch?.setFocus();
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
    const time = new Intl.DateTimeFormat('es-PE', { hour: '2-digit', minute: '2-digit' }).format(date);

    if (dayDifference === 0) {
      return `Hoy, ${time}`;
    }

    if (dayDifference === 1) {
      return `Ayer, ${time}`;
    }

    return new Intl.DateTimeFormat('es-PE', { day: 'numeric', month: 'short' }).format(date);
  }

  openNote(noteId: string) {
    return this.router.navigate(['/notes', this.folderId, noteId]);
  }

  async deleteNote(noteId: string, title: string) {
    const alert = await this.alertController.create({
      header: 'Eliminar nota',
      message: `¿Quieres eliminar “${title}”?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => void this.performNoteDelete(noteId)
        }
      ]
    });
    await alert.present();
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
    }
  }

  backToFolders() {
    return this.router.navigateByUrl('/home');
  }

  openSettings() {
    return this.router.navigateByUrl('/settings');
  }
}
