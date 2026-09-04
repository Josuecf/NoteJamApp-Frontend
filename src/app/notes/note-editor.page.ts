import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { NoteService } from './note.service';

interface NoteSection {
  title: string;
  content: string;
}

@Component({
  selector: 'app-note-editor',
  templateUrl: './note-editor.page.html',
  styleUrls: ['./note-editor.page.scss'],
  standalone: false
})
export class NoteEditorPage implements OnDestroy {
  readonly folderId: string;
  readonly noteId: string;
  title = '';
  content = '';
  errorMessage = '';
  statusMessage = '';
  isLoading = true;
  isSaving = false;
  isDirty = false;
  sections: NoteSection[] = [];
  private readonly noteSubscription: Subscription;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly noteService: NoteService
  ) {
    this.folderId = this.route.snapshot.paramMap.get('folderId') ?? '';
    this.noteId = this.route.snapshot.paramMap.get('noteId') ?? '';
    this.noteSubscription = this.noteService.watch(this.noteId).subscribe({
      next: (note) => {
        if (note && !this.isDirty) {
          this.title = note.title;
          this.content = note.content;
          this.updateSections();
        }
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'No se pudo cargar la nota.';
        this.isLoading = false;
      }
    });
  }

  async save() {
    this.errorMessage = '';
    this.statusMessage = '';

    if (!this.title.trim()) {
      this.errorMessage = 'El título es obligatorio.';
      return;
    }

    this.isSaving = true;

    try {
      await this.noteService.update(this.noteId, this.title, this.content);
      this.isDirty = false;
      this.statusMessage = 'Guardado';
    } catch {
      this.errorMessage = 'No se pudo guardar la nota.';
    } finally {
      this.isSaving = false;
    }
  }

  backToNotes() {
    return this.router.navigate(['/notes', this.folderId]);
  }

  markDirty() {
    this.isDirty = true;
    this.statusMessage = '';
  }

  onContentChange() {
    this.markDirty();
    this.updateSections();
  }

  private updateSections() {
    const lines = this.content.split(/\r?\n/);
    const sections: NoteSection[] = [];
    let currentSection: NoteSection | null = null;
    let unsectionedContent: string[] = [];

    for (const line of lines) {
      const heading = line.match(/^\s*(.+?):\s*$/);

      if (heading) {
        if (currentSection) {
          sections.push(currentSection);
        } else if (unsectionedContent.some((item) => item.trim())) {
          sections.push({ title: 'Contenido', content: unsectionedContent.join('\n').trim() });
        }

        currentSection = { title: heading[1].trim(), content: '' };
        unsectionedContent = [];
        continue;
      }

      if (currentSection) {
        currentSection.content += `${currentSection.content ? '\n' : ''}${line}`;
      } else {
        unsectionedContent.push(line);
      }
    }

    if (currentSection) {
      sections.push(currentSection);
    } else if (unsectionedContent.some((item) => item.trim())) {
      sections.push({ title: 'Contenido', content: unsectionedContent.join('\n').trim() });
    }

    this.sections = sections;
  }

  ngOnDestroy() {
    this.noteSubscription.unsubscribe();
  }
}
