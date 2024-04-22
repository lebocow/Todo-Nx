import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  {
    path: 'auth',
    loadChildren: async () =>
      await import('./pages/auth').then((m) => m.routes),
  },
  {
    path: 'dashboard',
    loadChildren: async () =>
      await import('./pages/dashboard').then((m) => m.routes),
  },
];
