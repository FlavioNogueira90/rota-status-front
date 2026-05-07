import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { Role } from './auth.models';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const allowedRoles = (route.data?.['roles'] ?? []) as Role[];

  if (!auth.isLogged()) {
    router.navigateByUrl('/login');
    return false;
  }

  // se ainda não carregou /me, deixa passar (a gente garante no app init)
  if (!auth.me()) return true;

  if (allowedRoles.length === 0 || auth.hasAnyRole(allowedRoles)) return true;

  router.navigateByUrl('/forbidden');
  return false;
};
