import { Routes } from '@angular/router';

import { HomeComponent } from './home/home.component';
import { UserFormComponent } from './user-form/user-form.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'home', component: HomeComponent },
    { path: 'user-form', component: UserFormComponent }
  ];
