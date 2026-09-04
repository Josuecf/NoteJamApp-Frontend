import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';

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
    private readonly router: Router
  ) {}

  backToFolders() {
    return this.router.navigateByUrl('/home');
  }

  async logout() {
    await this.authService.logout();
    return this.router.navigateByUrl('/login', { replaceUrl: true });
  }
}
