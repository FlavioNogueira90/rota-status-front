import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Entrega } from '../../shared/models/entrega.model';

export interface IniciarEntregaResponse {
  mensagem: string;
  entregaIniciadaNumero: number;
  statusEntregaIniciada: string;
  entregaInterrompidaNumero: number | null;
}

export interface ConcluirEntregaRequest {
  resultado: 'ENTREGUE' | 'DEVOLUCAO' | 'RECUSADO';
  motivoDevolucao: string | null;
  motivoRecusa: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class EntregasService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  listarEntregas(
    numeroManifesto: string | number
  ): Observable<Entrega[]> {

    return this.http.get<Entrega[]>(
      `${this.baseUrl}/manifestos/${numeroManifesto}/entregas`
    );
  }

  obterEntrega(
    numeroManifesto: string | number,
    numeroEntrega: string | number
  ): Observable<Entrega | null> {

    return this.listarEntregas(numeroManifesto).pipe(
      map((lista: Entrega[]) =>
        lista.find(
          entrega =>
            entrega.numero === Number(numeroEntrega)
        ) || null
      )
    );
  }

  iniciarEntrega(
    numeroManifesto: string | number,
    numeroEntrega: string | number
  ): Observable<IniciarEntregaResponse> {

    return this.http.post<IniciarEntregaResponse>(
      `${this.baseUrl}/manifestos/${numeroManifesto}/entregas/${numeroEntrega}/iniciar`,
      {},
      {
        params: {
          forcarInterrupcao: false
        }
      }
    );
  }

  registrarChegada(
    numeroManifesto: string | number,
    numeroEntrega: string | number
  ): Observable<void> {

    return this.http.post<void>(
      `${this.baseUrl}/manifestos/${numeroManifesto}/entregas/${numeroEntrega}/chegada`,
      {}
    );
  }

  concluirEntrega(
    numeroManifesto: string | number,
    numeroEntrega: string | number
  ): Observable<void> {

    const payload: ConcluirEntregaRequest = {
      resultado: 'ENTREGUE',
      motivoDevolucao: null,
      motivoRecusa: null
    };

    return this.http.post<void>(
      `${this.baseUrl}/manifestos/${numeroManifesto}/entregas/${numeroEntrega}/concluir`,
      payload
    );
  }

  iniciarEntregaComInterrupcao(
    numeroManifesto: string | number,
    numeroEntrega: string | number
  ): Observable<IniciarEntregaResponse> {

    return this.http.post<IniciarEntregaResponse>(
      `${this.baseUrl}/manifestos/${numeroManifesto}/entregas/${numeroEntrega}/iniciar-com-interrupcao`,
      {}
    );
  }

}