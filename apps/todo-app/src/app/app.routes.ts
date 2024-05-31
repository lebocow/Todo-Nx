import { Route } from '@angular/router';
import { authGuard } from '@lib/guards';

export const appRoutes: Route[] = [
  {
    path: 'auth',
    loadChildren: async () => await import('@pages/auth').then((m) => m.routes),
    canMatch: [authGuard({ requiresAuthentication: false })],
  },

  {
    path: '',
    loadChildren: async () =>
      await import('@pages/dashboard').then((m) => m.routes),
    canMatch: [authGuard()],
  },
];
