import { ApplicationConfig } from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor, serverErrorInterceptor } from '@lib/interceptors';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      appRoutes,
      withViewTransitions({ skipInitialTransition: true }),
    ),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([jwtInterceptor, serverErrorInterceptor]),
    ),
    provideToastr(),
  ],
};
