import {
  HttpErrorResponse,
  HttpInterceptorFn,
  HttpRequest,
  HttpStatusCode,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, TokenService } from '@lib/services';
import { catchError, switchMap, throwError, EMPTY } from 'rxjs';

export const serverErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const authSvc = inject(AuthService);
  const tokenSvc = inject(TokenService);
  const router = inject(Router);

  const handleUnauthorizedError = (req: HttpRequest<unknown>) => {
    if (tokenSvc.refreshToken) {
      return authSvc.refreshToken().pipe(
        switchMap((res: boolean) => {
          if (res) {
            const { accessToken } = tokenSvc;

            const modifiedReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${accessToken}`,
              },
            });

            return next(modifiedReq);
          }

          // Refresh token failed
          authSvc.logout();

          return EMPTY;
        }),
      );
    }

    // No refresh token
    authSvc.logout();

    return EMPTY;
  };

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case HttpStatusCode.InternalServerError:
          return throwError(() => error);

        case HttpStatusCode.Unauthorized:
          return handleUnauthorizedError(req);

        default:
          return throwError(() => error);
      }
    }),
  );
};
