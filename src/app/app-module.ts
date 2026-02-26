import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { LandingLayout } from './layouts/landing-layout/landing-layout';
import { HomeLayout } from './layouts/home-layout/home-layout';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
  declarations: [
    App,
    LandingLayout,
    HomeLayout
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient()
  ],
  bootstrap: [App]
})
export class AppModule { }
