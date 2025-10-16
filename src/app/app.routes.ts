import { Routes } from '@angular/router';
import { Login } from './components/login/login';

export const routes: Routes = [
  { path: '', component: Login },
  { path: 'login', component: Login },
  { path: '**', redirectTo: '' }
];
