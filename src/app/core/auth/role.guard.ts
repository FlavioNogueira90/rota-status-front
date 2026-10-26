import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';

import { AuthService } from './auth.service';
import { Role } from './auth.models';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = (route.data?.['roles'] ?? []) as Role[];

  if (!auth.isLogged()) {
    return router.createUrlTree(['/login']);
  }

  const user = auth.me();

  // Sem identidade conhecida, não concedemos acesso.
  if (!user) {
    return router.createUrlTree(['/login']);
  }

  // Identidade recuperada localmente, ainda não validada nesta execução.
  if (!auth.sessionValidated()) {

    // Acesso provisório apenas à experiência do motorista.
    if (
      user.role === 'MOTORISTA' &&
      allowedRoles.includes('MOTORISTA')
    ) {
      return true;
    }

    // Não liberar telas administrativas com identidade não validada.
    return router.createUrlTree(['/home']);
  }

  // Sessão validada: aplicar permissões normalmente.
  if (
    allowedRoles.length === 0 ||
    auth.hasAnyRole(allowedRoles)
  ) {
    return true;
  }

  return router.createUrlTree(['/forbidden']);
};