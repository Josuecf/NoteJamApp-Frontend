import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';
import { FolderService } from '../folders/folder.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {
  readonly folders$ = this.folderService.folders$;
  newFolderName = '';
  errorMessage = '';

  constructor(
    private readonly authService: AuthService,
    private readonly folderService: FolderService,
    private readonly router: Router
  ) {}

  openFolder(folderId: string) {
    return this.router.navigate(['/notes', folderId]);
  }

  async createFolder() {
    this.errorMessage = '';

    try {
      await this.folderService.create(this.newFolderName);
      this.newFolderName = '';
    } catch {
      this.errorMessage = 'Escribe un nombre válido para la carpeta.';
    }
  }

  async renameFolder(folderId: string, currentName: string) {
    const name = window.prompt('Nuevo nombre de la carpeta', currentName);

    if (name === null || name.trim() === currentName) {
      return;
    }

    try {
      await this.folderService.rename(folderId, name);
    } catch {
      this.errorMessage = 'No se pudo renombrar la carpeta.';
    }
  }

  async deleteFolder(folderId: string, name: string) {
    if (!window.confirm(`¿Eliminar la carpeta "${name}"?`)) {
      return;
    }

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
