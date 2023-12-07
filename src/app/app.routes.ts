import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { UserFormComponent } from './user-form/user-form.component';
import { FirestoreComponent } from './firestore/firestore.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'user-form', component: UserFormComponent },
  { path: 'firestore', component: FirestoreComponent }
];
