import { HttpInterceptorFn } from '@angular/common/http';
import { TokenStorage } from '../auth/token.storage';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = TokenStorage.getToken();
  if (!token) return next(req);

  // não anexar token no login
  if (req.url.includes('/auth/login')) return next(req);

  const tipo = TokenStorage.getType() || 'Bearer';

  const authReq = req.clone({
    setHeaders: { Authorization: `${tipo} ${token}` }
  });

  return next(authReq);
};
