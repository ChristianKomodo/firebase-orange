import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideHotToastConfig } from '@ngneat/hot-toast';

import { firebaseConfig } from 'src/firebase.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHotToastConfig(),  // @ngneat/hot-toast providers
    provideRouter(routes),
    importProvidersFrom(
      provideFirebaseApp(() => initializeApp(
        firebaseConfig)
      ),
      provideFirestore(() => getFirestore())),
    importProvidersFrom(provideAuth(() => getAuth())),
    importProvidersFrom(provideFirestore(() => getFirestore()))]
};
