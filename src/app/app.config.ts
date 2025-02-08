import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import {
  RouterModule,
  RouterOutlet,
  provideRouter,
  withHashLocation,
  withViewTransitions,
} from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { routes } from './app.routes';
import {
  HttpClientModule,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { authInterceptor } from '@services/interceptors/auth.interceptor';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeng/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideAnimationsAsync(),
    providePrimeNG({
      ripple: true,
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: false
        }
      },
    }),
    provideRouter(
      routes,
      withHashLocation(),
      withViewTransitions({
        onViewTransitionCreated() {},
      })
    ),
    importProvidersFrom(
      HttpClientModule,
      BrowserModule,
      RouterModule,
      BrowserAnimationsModule
    ),
    provideHttpClient(withInterceptors([authInterceptor])),
  ],
};
