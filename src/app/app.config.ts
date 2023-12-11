import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { RouterModule, provideRouter, withViewTransitions } from '@angular/router';

import { routes } from './app.routes';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withViewTransitions({
        onViewTransitionCreated(trainsitionInfo) {
          console.log(trainsitionInfo);
        },
      })
    ),
    importProvidersFrom(
      HttpClientModule,
      BrowserModule,
      RouterModule,
      BrowserAnimationsModule
    ),
  ],
};
