// eslint-disable-next-line @nx/enforce-module-boundaries
import { AuthResponseSchema } from './../../../../../../../shared/data-models/src/lib/auth/auth.response.schema';
import { inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { z } from 'zod';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  readonly isAuthenticated = signal<boolean>(false);

  private readonly router = inject(Router);
  private readonly httpClient = inject(HttpClient);
  private readonly cookieSvc = inject(CookieService);

  login(email: string, password: string): void {
    this.httpClient
      .post<z.infer<typeof AuthResponseSchema>>(
        'http://localhost:3000/v1/auth/login',
        { email, password }
      )
      .subscribe({
        next: (res) => {
          this.cookieSvc.set('accessToken', res.tokens.access.token, {
            expires: new Date(res.tokens.access.expires),
            sameSite: 'Strict',
            secure: true,
          });

          this.cookieSvc.set('refreshToken', res.tokens.refresh.token, {
            expires: new Date(res.tokens.refresh.expires),
            sameSite: 'Strict',
            secure: true,
          });

          this.isAuthenticated.set(true);
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Login failed:', error);
        },
      });
  }

  get accessToken(): string {
    return this.cookieSvc.get('accessToken');
  }

  get refreshToken(): string {
    return this.cookieSvc.get('refreshToken');
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  register(): void {}

  logout(): void {
    this.cookieSvc.delete('accessToken');
    this.cookieSvc.delete('refreshToken');
    this.isAuthenticated.set(false);
  }
}
