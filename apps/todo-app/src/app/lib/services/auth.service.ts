import { IAuthResponse } from '@myworkspace/data-models';
import { inject, Injectable, signal } from '@angular/core';

import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { TokenService } from './token.service';
import { UserService } from './user.service';
import { IApiResponse } from '@lib/interfaces';
import { TokenType } from '@prisma/client';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);
  private readonly router = inject(Router);

  private readonly tokenSvc = inject(TokenService);
  private readonly userSvc = inject(UserService);

  readonly isAuthenticated = signal<boolean>(false);

  login(
    email: string,
    password: string,
  ): Observable<IApiResponse<IAuthResponse>> {
    return this.httpClient
      .post<IApiResponse<IAuthResponse>>(
        'http://localhost:3000/v1/auth/login',
        {
          email,
          password,
        },
      )
      .pipe(
        switchMap((res: IApiResponse<IAuthResponse>) => {
          const { tokens, user } = res.data;

          this.userSvc.user.set(user);
          this.tokenSvc.setTokens(tokens);
          this.isAuthenticated.set(true);
          return of(res);
        }),
        catchError((error) => {
          return throwError(() => error);
        }),
      );
  }

  refreshToken(): Observable<boolean> {
    const { refreshToken } = this.tokenSvc;

    if (!refreshToken) {
      this.clearSession();
      return of(false);
    }

    return this.httpClient
      .post<IApiResponse<any>>('http://localhost:3000/v1/auth/refresh-token', {
        refreshToken,
      })
      .pipe(
        switchMap((res: IApiResponse<any>) => {
          if (res.data.user) {
            this.isAuthenticated.set(true);
            this.userSvc.user.set(res.data.user);
            this.tokenSvc.setToken(
              res.data.accessToken.token,
              TokenType.ACCESS,
              res.data.accessToken.expires,
            );

            return of(true);
          }

          this.clearSession();
          return of(false);
        }),
        catchError((error: HttpErrorResponse) => {
          this.clearSession();
          return of(false);
        }),
      );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  register(): void {}

  logout(): void {
    this.clearSession();
    this.router.navigateByUrl('/auth/login');
  }

  private clearSession(): void {
    this.tokenSvc.clear();
    this.isAuthenticated.set(false);
    this.userSvc.user.set(null);
  }
}
