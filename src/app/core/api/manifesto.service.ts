import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import { Manifesto } from '../../shared/models/manifesto.model';

export interface NovaEntregaRequest {
  numero: number;
  clienteNome: string;
  endereco: string;
}

export interface NovoManifestoRequest {
  numeroManifesto: number;
  motoristaId: number | null;
  veiculoId: number | null;
  entregas: NovaEntregaRequest[];
}

@Injectable({
  providedIn: 'root'
})
export class ManifestoService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  buscar(
    numeroManifesto: string | number
  ): Observable<Manifesto> {
    return this.http.get<Manifesto>(
      `${this.baseUrl}/manifestos/${numeroManifesto}`
    );
  }

  listarMeusManifestos(): Observable<Manifesto[]> {
    return this.http.get<Manifesto[]>(
      `${this.baseUrl}/manifestos/motorista`
    );
  }

  criarNovoManifesto(
    payload: NovoManifestoRequest
  ): Observable<Manifesto> {
    return this.http.post<Manifesto>(
      `${this.baseUrl}/manifestos/novoManifesto`,
      payload
    );
  }

  iniciarJornada(
    numeroManifesto: number
  ): Observable<string> {
    return this.http.post(
      `${this.baseUrl}/rotas/manifestos/${numeroManifesto}/iniciar-jornada`,
      {},
      { responseType: 'text' }
    );
  }
}