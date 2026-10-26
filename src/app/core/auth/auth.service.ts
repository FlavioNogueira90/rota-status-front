import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse, MeResponse, Role } from './auth.models';
import { TokenStorage } from './token.storage';
import { environment } from '../../../environments/environment';
import { UserStorage } from './user.storage';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private baseUrl = environment.apiUrl;


  loading = signal(false);

  sessionValidated = signal(false);

  me = signal<MeResponse | null>(
    TokenStorage.isLogged() ? UserStorage.get() : null
  );

  login(payload: LoginRequest): Observable<LoginResponse> {
    this.loading.set(true);

    return this.http.post<LoginResponse>(
      `${this.baseUrl}/auth/login`,
      payload
    ).pipe(
      tap(res => {
        // Evita misturar dados de usuários diferentes.
        UserStorage.clear();
        this.me.set(null);
        this.sessionValidated.set(false);

        TokenStorage.set(res.token, res.tipo);
      }),
      finalize(() => this.loading.set(false))
    );
  }

  loadMe(): Observable<MeResponse> {
    return this.http.get<MeResponse>(
      `${this.baseUrl}/auth/me`
    ).pipe(
      tap(user => {
        this.me.set(user);
        UserStorage.set(user);

        // Identidade confirmada pelo backend.
        this.sessionValidated.set(true);
      })
    );
  }

  logout(): void {
    TokenStorage.clear();
    UserStorage.clear();

    this.me.set(null);
    this.sessionValidated.set(false);
  }

  isLogged(): boolean {
    return TokenStorage.isLogged();
  }

  hasAnyRole(roles: Role[]): boolean {
    const user = this.me();
    return !!user && roles.includes(user.role);
  }
}
