import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

import {
  AtualizarVeiculoRequest,
  CriarVeiculoRequest,
  Veiculo
} from '../../shared/models/veiculo.model';

@Injectable({
  providedIn: 'root'
})
export class VeiculosService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  listar(): Observable<Veiculo[]> {
    return this.http.get<Veiculo[]>(
      `${this.baseUrl}/veiculos`
    );
  }

  listarAtivos(): Observable<Veiculo[]> {
    return this.http.get<Veiculo[]>(
      `${this.baseUrl}/veiculos/ativos`
    );
  }

  buscarPorId(id: number): Observable<Veiculo> {
    return this.http.get<Veiculo>(
      `${this.baseUrl}/veiculos/${id}`
    );
  }

  buscarPorPlaca(placa: string): Observable<Veiculo> {
    const placaNormalizada = this.normalizarPlaca(placa);

    return this.http.get<Veiculo>(
      `${this.baseUrl}/veiculos/placa/${placaNormalizada}`
    );
  }

  buscarPorPlacaParcial(placa: string): Observable<Veiculo[]> {
    const placaNormalizada = this.normalizarPlaca(placa);

    return this.http.get<Veiculo[]>(
      `${this.baseUrl}/veiculos/buscar`,
      {
        params: {
          placa: placaNormalizada
        }
      }
    );
  }

  criar(request: CriarVeiculoRequest): Observable<Veiculo> {
    return this.http.post<Veiculo>(
      `${this.baseUrl}/veiculos`,
      {
        ...request,
        placa: this.normalizarPlaca(request.placa)
      }
    );
  }

  atualizar(
    id: number,
    request: AtualizarVeiculoRequest
  ): Observable<Veiculo> {

    return this.http.put<Veiculo>(
      `${this.baseUrl}/veiculos/${id}`,
      {
        ...request,
        placa: this.normalizarPlaca(request.placa)
      }
    );
  }

  ativar(id: number): Observable<Veiculo> {
    return this.http.patch<Veiculo>(
      `${this.baseUrl}/veiculos/${id}/ativar`,
      {}
    );
  }

  inativar(id: number): Observable<Veiculo> {
    return this.http.patch<Veiculo>(
      `${this.baseUrl}/veiculos/${id}/inativar`,
      {}
    );
  }

  private normalizarPlaca(placa: string): string {
    return placa
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase();
  }
}