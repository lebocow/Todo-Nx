import { IAuthResponse, ITokens } from '@myworkspace/data-models';
import { inject, Injectable, signal } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { TokenService } from './token.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly httpClient = inject(HttpClient);

  private readonly tokenSvc = inject(TokenService);
  private readonly userSvc = inject(UserService);

  readonly isAuthenticated = signal<boolean>(false);

  login(email: string, password: string): Observable<IAuthResponse> {
    return this.httpClient
      .post<IAuthResponse>('http://localhost:3000/v1/auth/login', {
        email,
        password,
      })
      .pipe(
        switchMap((res: IAuthResponse) => {
          const { tokens, user } = res;

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

  reAuthenticate(refreshToken: string): Observable<ITokens> {
    return this.httpClient
      .post<ITokens>('http://localhost:3000/v1/auth/refresh-token', {
        refreshToken,
      })
      .pipe(
        switchMap((res: ITokens) => {
          this.tokenSvc.setTokens(res);
          this.isAuthenticated.set(true);
          return of(res);
        }),
        catchError((error) => {
          this.isAuthenticated.set(false);
          this.tokenSvc.clear();
          return throwError(() => error);
        }),
      );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  register(): void {}

  logout(): void {
    this.tokenSvc.clear();
    this.isAuthenticated.set(false);
  }
}
