import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage {
  email = '';
  password = '';
  errorMessage = '';
  isSubmitting = false;

  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  async login() {
    this.errorMessage = '';
    this.isSubmitting = true;

    try {
      await this.authService.login(this.email, this.password);
      await this.router.navigateByUrl('/home');
    } catch {
      this.errorMessage = 'No se pudo iniciar sesión. Revisa tus datos.';
    } finally {
      this.isSubmitting = false;
    }
  }
}
