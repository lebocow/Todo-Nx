import { inject, Injectable } from '@angular/core';
import { ITokens } from '@myworkspace/data-models';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly cookieSvc = inject(CookieService);

  get accessToken(): string {
    return this.cookieSvc.get('accessToken');
  }

  get refreshToken(): string {
    return this.cookieSvc.get('refreshToken');
  }

  setTokens(tokens: ITokens): void {
    this.cookieSvc.set('accessToken', tokens.access.token, {
      expires: new Date(tokens.access.expires),
      sameSite: 'Strict',
      secure: false, // Set to true if using HTTPS
      path: '/',
    });

    this.cookieSvc.set('refreshToken', tokens.refresh.token, {
      expires: new Date(tokens.refresh.expires),
      sameSite: 'Strict',
      secure: false, // Set to true if using HTTPS
      path: '/',
    });
  }

  clear(): void {
    this.cookieSvc.delete('accessToken');
    this.cookieSvc.delete('refreshToken');
  }
}
