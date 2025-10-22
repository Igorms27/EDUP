import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth';

/**
 * Guard de roles (papéis)
 * Verifica se o usuário tem o papel necessário para acessar a rota
 */
export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const user = authService.getCurrentUser()();

    // Verifica se está autenticado
    if (!user) {
      return router.createUrlTree(['/login']);
    }

    // Verifica se o usuário tem um dos roles permitidos
    if (allowedRoles.includes(user.type)) {
      return true;
    }

    // Redireciona para a dashboard correta do usuário se tentar acessar área não autorizada
    return router.createUrlTree([`/${user.type === 'teacher' ? 'professor' : user.type}-dashboard`]);
  };
};

