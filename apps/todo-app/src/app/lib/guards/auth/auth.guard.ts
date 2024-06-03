import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@lib/services';
import { map } from 'rxjs';

interface AuthGuardOptions {
  requiresAuthentication: boolean;
}

const defaultAuthGuardOptions = (): AuthGuardOptions => ({
  requiresAuthentication: true,
});

export const authGuard = (
  options: AuthGuardOptions = defaultAuthGuardOptions(),
): CanMatchFn => {
  return (_: Route, segments: UrlSegment[]) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return authService.refreshToken().pipe(
      map((isAuthenticated: boolean) => {
        const currentUrl = segments.map((s) => s.path).join('/');
        const isAuthPage =
          currentUrl === 'auth/login' || currentUrl === 'auth/register';

        if (isAuthenticated && options.requiresAuthentication) {
          return true;
        }

        if (isAuthPage && !isAuthenticated) {
          return true;
        }

        if (options.requiresAuthentication && !isAuthenticated) {
          return router.createUrlTree(['/auth/login'], {
            queryParams: {
              returnUrl: currentUrl,
            },
          });
        }

        return router.createUrlTree(['/']);
      }),
    );
  };
};
