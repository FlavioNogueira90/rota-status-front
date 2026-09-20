import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '../../../environments/environment';
import { Entrega } from '../../shared/models/entrega.model';

import {
  EntregaNotaFiscal,
  StatusNotaFiscal,
  MotivoDevolucao,
  MotivoNaoRealizacao
} from '../../shared/models/entrega-nota-fiscal.model';


export interface IniciarEntregaResponse {
  mensagem: string;
  entregaIniciadaNumero: number;
  statusEntregaIniciada: string;
  entregaInterrompidaNumero: number | null;
}


/* =========================================================
   RESULTADO DE NOTA FISCAL
   ========================================================= */

export interface RegistrarResultadoNotaFiscalRequest {
  status: StatusNotaFiscal;
  motivoDevolucao: MotivoDevolucao | null;
  motivoNaoRealizacao: MotivoNaoRealizacao | null;
  justificativa: string | null;
}


/* =========================================================
   OCORRÊNCIA DE ENTREGA
   ========================================================= */

export type MotivoOcorrenciaEntrega =
  | 'CLIENTE_SEM_SISTEMA'
  | 'CLIENTE_FECHADO'
  | 'CLIENTE_AUSENTE'
  | 'CLIENTE_SEM_ESPACO'
  | 'FILA_OU_ESPERA'
  | 'ACESSO_BLOQUEADO'
  | 'ENDERECO_NAO_LOCALIZADO'
  | 'PROBLEMA_NO_VEICULO'
  | 'PROBLEMA_NA_CARGA'
  | 'DIVERGENCIA_DOCUMENTAL'
  | 'OUTRO';


export interface RegistrarOcorrenciaEntregaRequest {
  motivo: MotivoOcorrenciaEntrega;
  observacao: string | null;
}


/* =========================================================
   FINALIZAÇÃO SEM NOVA TENTATIVA
   ========================================================= */

export interface FinalizarEntregaSemNovaTentativaRequest {
  motivo: MotivoNaoRealizacao;
  justificativa: string | null;
}


@Injectable({
  providedIn: 'root'
})
export class EntregasService {

  private readonly http = inject(HttpClient);

  private readonly baseUrl = environment.apiUrl;


  /* =======================================================
     CONSULTAS
     ======================================================= */

  listarEntregas(
    numeroManifesto: string | number
  ): Observable<Entrega[]> {

    return this.http.get<Entrega[]>(
      `${this.baseUrl}/manifestos/${numeroManifesto}/entregas`
    );
  }


  listarNotasFiscais(
    numeroManifesto: string | number,
    numeroEntrega: string | number
  ): Observable<EntregaNotaFiscal[]> {

    return this.http.get<EntregaNotaFiscal[]>(
      `${this.baseUrl}/manifestos/${numeroManifesto}/entregas/${numeroEntrega}/notas-fiscais`
    );
  }


  obterEntrega(
    numeroManifesto: string | number,
    numeroEntrega: string | number
  ): Observable<Entrega | null> {

    return this.listarEntregas(
      numeroManifesto
    ).pipe(

      map((lista: Entrega[]) =>
        lista.find(
          entrega =>
            entrega.numero === Number(numeroEntrega)
        ) || null
      )

    );
  }


  /* =======================================================
     EXECUÇÃO DA ENTREGA
     ======================================================= */

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


  iniciarEntregaComInterrupcao(
    numeroManifesto: string | number,
    numeroEntrega: string | number
  ): Observable<IniciarEntregaResponse> {

    return this.http.post<IniciarEntregaResponse>(
      `${this.baseUrl}/manifestos/${numeroManifesto}/entregas/${numeroEntrega}/iniciar-com-interrupcao`,
      {}
    );
  }


  /* =======================================================
     RESULTADO DE NOTA FISCAL
     ======================================================= */

  registrarResultadoNotaFiscal(
    entregaNotaFiscalId: string,
    payload: RegistrarResultadoNotaFiscalRequest
  ): Observable<EntregaNotaFiscal> {

    return this.http.put<EntregaNotaFiscal>(
      `${this.baseUrl}/manifestos/entregas/notas-fiscais/${entregaNotaFiscalId}/resultado`,
      payload
    );
  }


  /* =======================================================
     OCORRÊNCIA
     ======================================================= */

  registrarOcorrencia(
    numeroManifesto: string | number,
    numeroEntrega: string | number,
    payload: RegistrarOcorrenciaEntregaRequest
  ): Observable<void> {

    return this.http.post<void>(
      `${this.baseUrl}/manifestos/${numeroManifesto}/entregas/${numeroEntrega}/ocorrencias`,
      payload
    );
  }


  /* =======================================================
     FINALIZAÇÃO SEM NOVA TENTATIVA
     ======================================================= */

  finalizarSemNovaTentativa(
    numeroManifesto: string | number,
    numeroEntrega: string | number,
    payload: FinalizarEntregaSemNovaTentativaRequest
  ): Observable<void> {

    return this.http.post<void>(
      `${this.baseUrl}/manifestos/${numeroManifesto}/entregas/${numeroEntrega}/finalizar-sem-nova-tentativa`,
      payload
    );
  }

}