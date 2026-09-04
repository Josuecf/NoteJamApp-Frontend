import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: false
})
export class SplashPage implements OnInit {
  constructor(
    private readonly authService: AuthService,
    private readonly router: Router
  ) {}

  async ngOnInit() {
    const [user] = await Promise.all([
      firstValueFrom(this.authService.user$),
      new Promise<void>((resolve) => window.setTimeout(resolve, 700))
    ]);

    await this.router.navigateByUrl(user ? '/home' : '/login', { replaceUrl: true });
  }
}
