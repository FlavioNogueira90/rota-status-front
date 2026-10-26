import { ApplicationConfig, APP_INITIALIZER, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { firstValueFrom, timeout } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from  './core/auth/auth.interceptor';
import { AuthService } from './core/auth/auth.service';
import { TokenStorage } from './core/auth/token.storage';
import { provideServiceWorker } from '@angular/service-worker';


export function initAuth(auth: AuthService) {
  return async () => {
    if (!TokenStorage.isLogged()) {
      return;
    }

    try {
      await firstValueFrom(
        auth.loadMe().pipe(
          timeout(5000)
        )
      );

    } catch (error) {

      if (
        error instanceof HttpErrorResponse &&
        (error.status === 401 || error.status === 403)
      ) {
        console.warn(
          '[RotaOne] Sessão rejeitada pelo servidor.'
        );

        auth.logout();
        return;
      }

      console.warn(
        '[RotaOne] Falha temporária ao validar sessão. Token preservado.',
        error
      );

      // Não fazemos logout em erros de rede ou timeout.
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
    },
    provideServiceWorker('ngsw-worker.js', {
        enabled: !isDevMode(),
        registrationStrategy: 'registerWhenStable:30000'
    })
]
};
