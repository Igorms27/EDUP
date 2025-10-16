import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { StudentDashboard } from './components/student-dashboard/student-dashboard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'student-dashboard', component: StudentDashboard },
  { path: '**', redirectTo: '/login' }
];
