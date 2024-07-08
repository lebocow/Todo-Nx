import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter, withViewTransitions } from '@angular/router';
import { jwtInterceptor, serverErrorInterceptor } from '@lib/interceptors';
import { AvatarModule } from 'ngx-avatars';
import { provideToastr } from 'ngx-toastr';
import { appRoutes } from './app.routes';

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
    importProvidersFrom(AvatarModule.forRoot()),
  ],
};
