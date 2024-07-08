import type { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService, TokenService } from '@lib/services';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const tokenService = inject(TokenService);

  if (authService.isAuthenticated() && tokenService.accessToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${tokenService.accessToken}`,
      },
    });
  }

  return next(req);
};
