import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';

/**
 * Guard de autenticação
 * Verifica se o usuário está autenticado antes de acessar a rota
 */
export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getIsAuthenticated()()) {
    return true;
  }

  // Redireciona para login se não estiver autenticado
  return router.createUrlTree(['/login']);
};

