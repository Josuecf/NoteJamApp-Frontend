import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { AuthService } from '../../../../core/auth/auth.service';
import { AppearanceMode, ThemeService } from '../../../../core/theme/theme.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
  standalone: false
})
export class SettingsPage {
  readonly user$ = this.authService.user$;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly themeService: ThemeService,
    private readonly alertController: AlertController
  ) {}

  get appearance() {
    return this.themeService.appearance;
  }

  setAppearance(mode: AppearanceMode) {
    this.themeService.setAppearance(mode);
  }

  backToFolders() {
    return this.router.navigateByUrl('/home');
  }

  async logout() {
    const alert = await this.alertController.create({
      header: 'Cerrar sesión',
      message: 'Tus datos sincronizados permanecerán disponibles cuando vuelvas a iniciar sesión.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Cerrar sesión',
          role: 'destructive',
          handler: () => void this.performLogout()
        }
      ]
    });
    await alert.present();
  }

  async showInformation(title: string, message: string) {
    const alert = await this.alertController.create({
      header: title,
      message,
      buttons: ['Aceptar']
    });
    await alert.present();
  }

  private async performLogout() {
    await this.authService.logout();
    await this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
