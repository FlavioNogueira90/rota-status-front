import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';
import {
  ChecklistPreRotaRequest,
  ChecklistPreRotaResponse
} from '../../shared/models/checklist-pre-rota.model';

@Injectable({
  providedIn: 'root'
})
export class ChecklistPreRotaService {

  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  buscar(
    numeroManifesto: string | number
  ): Observable<ChecklistPreRotaResponse> {

    return this.http.get<ChecklistPreRotaResponse>(
      `${this.baseUrl}/manifestos/${numeroManifesto}/checklist`
    );
  }

  salvar(
    numeroManifesto: string | number,
    payload: ChecklistPreRotaRequest
  ): Observable<ChecklistPreRotaResponse> {

    return this.http.put<ChecklistPreRotaResponse>(
      `${this.baseUrl}/manifestos/${numeroManifesto}/checklist`,
      payload
    );
  }

  concluir(
    numeroManifesto: string | number
  ): Observable<ChecklistPreRotaResponse> {

    return this.http.post<ChecklistPreRotaResponse>(
      `${this.baseUrl}/manifestos/${numeroManifesto}/checklist/concluir`,
      {}
    );
  }
}