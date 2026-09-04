import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { LoginRequest, LoginResponse, MeResponse, Role } from './auth.models';
import { TokenStorage } from './token.storage';
import { environment } from '../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);

  private baseUrl = environment.apiUrl;


  loading = signal(false);
  me = signal<MeResponse | null>(null);

  login(payload: LoginRequest): Observable<LoginResponse> {
    this.loading.set(true);
    return this.http.post<LoginResponse>(`${this.baseUrl}/auth/login`, payload).pipe(
      tap(res => TokenStorage.set(res.token, res.tipo)),
      finalize(() => this.loading.set(false))
    );
  }

  loadMe(): Observable<MeResponse> {
    return this.http.get<MeResponse>(`${this.baseUrl}/auth/me`).pipe(
      tap(user => this.me.set(user))
    );
  }

  logout(): void {
    TokenStorage.clear();
    this.me.set(null);
  }

  isLogged(): boolean {
    return TokenStorage.isLogged();
  }

  hasAnyRole(roles: Role[]): boolean {
    const user = this.me();
    return !!user && roles.includes(user.role);
  }
}
