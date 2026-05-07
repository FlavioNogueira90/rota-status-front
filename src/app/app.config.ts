import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { routes } from './app.routes';
import { authInterceptor } from  './core/auth/auth.interceptor';
import { AuthService } from './core/auth/auth.service';
import { TokenStorage } from './core/auth/token.storage';

export function initAuth(auth: AuthService) {
  return async () => {
    if (!TokenStorage.isLogged()) return;

    try {
      await firstValueFrom(auth.loadMe());
    } catch {
      auth.logout(); // token inválido/expirado
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),

    // ✅ HTTP + JWT interceptor
    provideHttpClient(withInterceptors([authInterceptor])),

    // ✅ Carrega /auth/me ao iniciar (se existir token)
    {
      provide: APP_INITIALIZER,
      useFactory: initAuth,
      deps: [AuthService],
      multi: true
    }
  ]
};
