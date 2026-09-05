import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export type UsuarioRole = 'ADMIN' | 'OPERADOR' | 'MOTORISTA';

export interface UsuarioResponse {
  id: number;
  cpf: string;
  nome: string;
  email: string;
  telefone: string;
  role: UsuarioRole;
  ativo: boolean;
}

export interface CriarUsuarioRequest {
  cpf: string;
  nome: string;
  email: string;
  telefone: string;
  senha: string;
  role: UsuarioRole;
}

export interface AtualizarUsuarioRequest {
  nome: string;
  email: string;
  telefone: string;
  role: UsuarioRole;
}

export interface ResetarSenhaRequest {
  novaSenha: string;
}

export interface MotoristaOption {
  id: number;
  nome: string;
  cpf: string;
  cpfMascarado: string;
}
@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  listarUsuarios(): Observable<UsuarioResponse[]> {
    return this.http.get<UsuarioResponse[]>(`${this.baseUrl}/usuarios`);
  }

  criarUsuario(request: CriarUsuarioRequest): Observable<UsuarioResponse> {
    return this.http.post<UsuarioResponse>(`${this.baseUrl}/usuarios`, request);
  }

  buscarPorId(id: number): Observable<UsuarioResponse> {
  return this.http.get<UsuarioResponse>(`${this.baseUrl}/usuarios/${id}`);
  }

  atualizarUsuario(id: number, request: AtualizarUsuarioRequest): Observable<UsuarioResponse> {
    return this.http.put<UsuarioResponse>(`${this.baseUrl}/usuarios/${id}`, request);
  }

  ativarUsuario(cpf: string): Observable<UsuarioResponse> {
  const cpfLimpo = cpf.replace(/\D/g, '');
  return this.http.patch<UsuarioResponse>(`${this.baseUrl}/usuarios/cpf/${cpfLimpo}/ativar`, {});
  }

  inativarUsuario(cpf: string): Observable<UsuarioResponse> {
    const cpfLimpo = cpf.replace(/\D/g, '');
    return this.http.patch<UsuarioResponse>(`${this.baseUrl}/usuarios/cpf/${cpfLimpo}/inativar`, {});
  }

  resetarSenha(cpf: string, request: ResetarSenhaRequest): Observable<UsuarioResponse> {
    const cpfLimpo = cpf.replace(/\D/g, '');
    return this.http.patch<UsuarioResponse>(
      `${this.baseUrl}/usuarios/cpf/${cpfLimpo}/resetar-senha`,
      request
    );
  }

  buscarMotoristas(search: string): Observable<MotoristaOption[]> {
    return this.http.get<MotoristaOption[]>(
      `${this.baseUrl}/usuarios/motoristas`,
      {
        params: { search }
      }
    );
  }
}