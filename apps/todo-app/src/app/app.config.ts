import { ApplicationConfig } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withViewTransitions({ skipInitialTransition: true })
    ),
    provideAnimationsAsync(),
  ],
};
