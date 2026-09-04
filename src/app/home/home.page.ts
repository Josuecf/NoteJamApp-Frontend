import { Component, ViewChild } from '@angular/core';
import { IonSearchbar } from '@ionic/angular';
import { AlertController } from '@ionic/angular';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { FolderService } from '../folders/folder.service';
import { Folder } from '../folders/folder.model';
import { NoteService } from '../notes/note.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  readonly folderColors = ['#3164F4', '#54C7B0', '#F0647A', '#F5B544', '#9165E8', '#AEB7C8'];
  @ViewChild('folderSearch') folderSearch?: IonSearchbar;
  readonly folders$ = this.folderService.folders$;
  readonly noteCounts$ = this.noteService.countsByFolder$;
  folderName = '';
  folderColor = this.folderColors[0];
  folderDescription = '';
  searchTerm = '';
  isFolderFormOpen = false;
  editingFolder: Folder | null = null;
  errorMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly folderService: FolderService,
    private readonly noteService: NoteService,
    private readonly router: Router,
    private readonly alertController: AlertController
  ) {}

  openFolder(folderId: string) {
    return this.router.navigate(['/notes', folderId]);
  }

  openSettings() {
    return this.router.navigateByUrl('/settings');
  }

  async focusSearch() {
    await this.folderSearch?.setFocus();
  }

  filterFolders(folders: Folder[]) {
    const search = this.searchTerm.trim().toLocaleLowerCase();

    if (!search) {
      return folders;
    }

    return folders.filter((folder) => folder.name.toLocaleLowerCase().includes(search));
  }

  openCreateFolder() {
    this.editingFolder = null;
    this.folderName = '';
    this.folderColor = this.folderColors[0];
    this.folderDescription = '';
    this.isFolderFormOpen = true;
    this.errorMessage = '';
  }

  openEditFolder(folder: Folder) {
    this.editingFolder = folder;
    this.folderName = folder.name;
    this.folderColor = folder.color || this.folderColors[0];
    this.folderDescription = folder.description || '';
    this.isFolderFormOpen = true;
    this.errorMessage = '';
  }

  closeFolderForm() {
    this.isFolderFormOpen = false;
    this.editingFolder = null;
    this.folderName = '';
    this.folderColor = this.folderColors[0];
    this.folderDescription = '';
    this.errorMessage = '';
  }

  async saveFolder() {
    this.errorMessage = '';

    try {
      if (this.editingFolder) {
        await this.folderService.rename(this.editingFolder.id, this.folderName, this.folderColor, this.folderDescription);
      } else {
        await this.folderService.create(this.folderName, this.folderColor, this.folderDescription);
      }
      this.closeFolderForm();
    } catch {
      this.errorMessage = 'Escribe un nombre válido para la carpeta.';
    }
  }

  async deleteFolder(folderId: string, name: string) {
    const alert = await this.alertController.create({
      header: 'Eliminar carpeta',
      message: `¿Quieres eliminar “${name}”?`,
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => void this.performFolderDelete(folderId)
        }
      ]
    });
    await alert.present();
  }

  private async performFolderDelete(folderId: string) {
    try {
      await this.folderService.delete(folderId);
    } catch {
      this.errorMessage = 'No se pudo eliminar la carpeta.';
    }
  }

  async logout() {
    await this.authService.logout();
    return this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
