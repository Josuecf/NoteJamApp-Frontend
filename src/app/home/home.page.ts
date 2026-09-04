import { Component } from '@angular/core';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: false,
})
export class HomePage {

  constructor(private readonly authService: AuthService) {}

  logout() {
    return this.authService.logout();
  }
}
