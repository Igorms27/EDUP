/**
 * Arquivo de configuração das rotas da aplicação Angular.
 * Define todas as rotas disponíveis na aplicação, incluindo redirecionamentos, componentes
 * associados e proteções de rotas (guards) para controle de acesso baseado em autenticação
 * e permissões de usuário (estudante, professor, coordenador).
 */
import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login';
import { StudentDashboardComponent } from './components/student-dashboard/student-dashboard';
import { ProfessorDashboardComponent } from './components/professor-dashboard/professor-dashboard';
import { CoordinatorDashboardComponent } from './components/coordinator-dashboard/coordinator-dashboard';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'student-dashboard', 
    component: StudentDashboardComponent,
    canActivate: [authGuard, roleGuard(['student'])]
  },
  { 
    path: 'professor-dashboard', 
    component: ProfessorDashboardComponent,
    canActivate: [authGuard, roleGuard(['teacher'])]
  },
  { 
    path: 'coordinator-dashboard', 
    component: CoordinatorDashboardComponent,
    canActivate: [authGuard, roleGuard(['coordinator'])]
  },
  { path: '**', redirectTo: '/login' }
];
