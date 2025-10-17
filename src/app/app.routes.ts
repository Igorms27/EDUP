import { Routes } from '@angular/router';
import { Login } from './components/login/login';
import { StudentDashboard } from './components/student-dashboard/student-dashboard';
import { ProfessorDashboard } from './components/professor-dashboard/professor-dashboard';
import { CoordinatorDashboard } from './components/coordinator-dashboard/coordinator-dashboard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'student-dashboard', component: StudentDashboard },
  { path: 'professor-dashboard', component: ProfessorDashboard },
  { path: 'coordinator-dashboard', component: CoordinatorDashboard },
  { path: '**', redirectTo: '/login' }
];
