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
      await Promise.race([
        this.authService.login(this.email, this.password),
        new Promise<never>((_, reject) => {
          window.setTimeout(() => reject(new Error('LOGIN_TIMEOUT')), 15000);
        })
      ]);
      await this.router.navigateByUrl('/home');
    } catch (error) {
      this.errorMessage = error instanceof Error && error.message === 'LOGIN_TIMEOUT'
        ? 'La conexión con Firebase tardó demasiado. Comprueba la conexión a Internet.'
        : 'No se pudo iniciar sesión. Revisa tus datos y la configuración de Firebase.';
    } finally {
      this.isSubmitting = false;
    }
  }
}
