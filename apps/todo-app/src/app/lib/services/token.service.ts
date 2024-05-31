import { inject, Injectable } from '@angular/core';
import { ITokens } from '@myworkspace/data-models';
import { TokenType } from '@prisma/client';
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
    this.setToken(tokens.access.token, TokenType.ACCESS, tokens.access.expires);

    this.setToken(
      tokens.refresh.token,
      TokenType.REFRESH,
      tokens.refresh.expires,
    );
  }

  setToken(token: string, type: TokenType, expires: number): void {
    const cookieName = this.getCookieName(type);

    this.cookieSvc.set(cookieName, token, {
      expires: new Date(expires),
      sameSite: 'Strict',
      secure: false, // Set to true if using HTTPS
      path: '/',
    });
  }

  private getCookieName(type: TokenType): string {
    switch (type) {
      case TokenType.ACCESS:
        return 'accessToken';
      case TokenType.REFRESH:
        return 'refreshToken';
      default:
        throw new Error('Invalid token type');
    }
  }

  clear(): void {
    this.cookieSvc.delete('accessToken');
    this.cookieSvc.delete('refreshToken');
  }
}
