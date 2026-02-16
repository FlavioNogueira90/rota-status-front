import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Manifesto } from '../../shared/models/manifesto.model';

export interface NovaEntregaRequest {
  numero: number;
  clienteNome: string;
  endereco: string;
}

export interface NovoManifestoRequest {
  numeroManifesto: number;
  motoristaId: string;
  veiculoPlaca: string;
  entregas: NovaEntregaRequest[];
}

@Injectable({ providedIn: 'root' })
export class ManifestoService {
  constructor(private http: HttpClient) {}

  buscar(numeroManifesto: string | number): Observable<Manifesto> {
    return this.http.get<Manifesto>(`/manifestos/${numeroManifesto}`);
  }

  criarNovoManifesto(payload: NovoManifestoRequest): Observable<Manifesto> {
    return this.http.post<Manifesto>(`/manifestos/novoManifesto`, payload);
  }
}
