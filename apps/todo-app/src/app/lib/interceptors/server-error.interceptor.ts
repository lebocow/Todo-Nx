import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpStatusCode,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, TokenService } from '@lib/services';
import { catchError, switchMap, throwError, EMPTY } from 'rxjs';
import { ITokens } from '@myworkspace/data-models';

export const serverErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const authSvc = inject(AuthService);
  const tokenSvc = inject(TokenService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === HttpStatusCode.Unauthorized) {
        // Attempt to refresh token
        if (tokenSvc.refreshToken) {
          return authSvc.reAuthenticate(tokenSvc.refreshToken).pipe(
            switchMap((res: ITokens) => {
              const { accessToken } = tokenSvc;

              const modifiedReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${accessToken}`,
                },
              });

              return next(modifiedReq);
            }),
            catchError((refreshError: HttpErrorResponse) => {
              if (refreshError.status === HttpStatusCode.Unauthorized)
                authSvc.logout();

              return throwError(() => refreshError);
            }),
          );
        } else {
          authSvc.logout();
          router.navigateByUrl('/auth/login');
          return EMPTY;
        }
      }

      return throwError(() => error);
    }),
  );
};
