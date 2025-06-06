import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { IApiResponse } from '@lib/interfaces';
import {
  ILoginResponse,
  IRefreshTokenResponse,
  IRegisterResponse,
} from '@myworkspace/data-models';
import { TokenType } from '@prisma/client';
import { Observable, catchError, of, switchMap, throwError } from 'rxjs';
import { environment } from './../../../environments/environment';
import { TokenService } from './token.service';
import { UserService } from './user.service';

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
  ): Observable<IApiResponse<ILoginResponse>> {
    return this.httpClient
      .post<IApiResponse<ILoginResponse>>(`${environment.apiUrl}/auth/login`, {
        email,
        password,
      })
      .pipe(
        switchMap((res: IApiResponse<ILoginResponse>) => {
          const { tokens, user } = res.data;

          this.userSvc.user.set(user);
          this.tokenSvc.setTokens(tokens);
          this.isAuthenticated.set(true);

          return of(res);
        }),
        catchError((error: HttpErrorResponse) => {
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

    if (this.isAuthenticated() && this.tokenSvc.accessToken) {
      return of(true);
    }

    return this.httpClient
      .post<IApiResponse<IRefreshTokenResponse>>(
        `${environment.apiUrl}/auth/refresh-token`,
        {
          refreshToken,
        },
      )
      .pipe(
        switchMap((res: IApiResponse<IRefreshTokenResponse>) => {
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

  register(
    name: string,
    email: string,
    password: string,
    confirmPassword: string,
  ) {
    return this.httpClient
      .post<IApiResponse<IRegisterResponse>>(
        `${environment.apiUrl}/auth/register`,
        {
          name,
          email,
          password,
          confirmPassword,
        },
      )
      .pipe(
        switchMap((res: IApiResponse<IRegisterResponse>) => {
          this.router.navigateByUrl('/auth/login');
          return of(res);
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        }),
      );
  }

  logout() {
    this.httpClient
      .post<IApiResponse<any>>(`${environment.apiUrl}/auth/logout`, {
        refreshToken: this.tokenSvc.refreshToken,
      })
      .pipe(
        switchMap((res: IApiResponse<any>) => {
          this.clearSession();
          this.router.navigateByUrl('/auth/login');
          return of(res);
        }),
        catchError((error: HttpErrorResponse) => {
          return throwError(() => error);
        }),
      )
      .subscribe();
  }

  private clearSession(): void {
    this.tokenSvc.clear();
    this.isAuthenticated.set(false);
    this.userSvc.user.set(null);
  }
}
