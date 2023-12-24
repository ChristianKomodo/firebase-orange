import { Routes } from '@angular/router';
import { canActivate, redirectLoggedInTo, redirectUnauthorizedTo } from '@angular/fire/auth-guard';

import { HomeComponent } from './home/home.component';
import { UserFormComponent } from './user-form/user-form.component';
import { FirestoreComponent } from './firestore/firestore.component';
import { UserDataComponent } from './user-data/user-data.component';
import { YourMoviesComponent } from './your-movies/your-movies.component';

// redirects logged in users
const redirectLoggedInToFirestore = () => redirectLoggedInTo(['firestore']);
// redirects not-logged in users
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['user-form']);

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'user-form', component: UserFormComponent },
  // The below long-hand version doesn't work because it can't find [AngularFireAuthGuard] and it's not an import
  // { path: 'login', component: FirestoreComponent, canActivate: [AngularFireAuthGuard], data: { authGuardPipe: redirectUnauthorizedToLogin } },
  // Instead, use this short-hand version:
  { path: 'firestore', component: FirestoreComponent, ...canActivate(redirectUnauthorizedToLogin) },
  { path: 'user-data', component: UserDataComponent, ...canActivate(redirectUnauthorizedToLogin) },
  { path: 'reviews', component: YourMoviesComponent, ...canActivate(redirectUnauthorizedToLogin) },
];
