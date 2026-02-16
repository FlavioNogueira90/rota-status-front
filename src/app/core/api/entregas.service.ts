import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entrega } from '../../shared/models/entrega.model';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class EntregasService {
  constructor(private http: HttpClient) {}

  listarEntregas(numeroManifesto: string | number): Observable<Entrega[]> {
    return this.http.get<Entrega[]>(`/manifestos/${numeroManifesto}/entregas`);
  }

  obterEntrega(numeroManifesto: string | number, numeroEntrega: string | number) {
    return this.listarEntregas(numeroManifesto).pipe(
      map((lista: Entrega[]) => lista.find(e => e.numero === Number(numeroEntrega)) || null)
    );
  }
}
