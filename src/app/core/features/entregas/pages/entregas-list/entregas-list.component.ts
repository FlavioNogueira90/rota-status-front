import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { EntregasService } from '../../../../../core/api/entregas.service';
import { Entrega } from '../../../../../shared/models/entrega.model';

@Component({
  selector: 'app-entregas-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <h1>Entregas</h1>

    <div style="margin: 12px 0;">
      <label>Manifesto nº:</label>
      <input style="margin-left:8px;" [(ngModel)]="numeroManifesto" placeholder="Ex: 9001" />
      <button style="margin-left:8px;" (click)="carregar()">Procurar</button>
    </div>

    <table *ngIf="entregas$ | async as entregas" border="1" cellpadding="6" cellspacing="0">
      <thead>
        <tr>
          <th>Nº</th>
          <th>Cliente</th>
          <th>Endereço</th>
          <th>Status</th>
          <th>Início</th>
          <th>Chegada no cliente</th>
          <th>Conclusão</th>
          <th>Motivo devolução</th>
        </tr>
      </thead>

      <tbody>
        <tr *ngFor="let e of entregas">
          <td>{{ e.numero }}</td>
          <td>{{ e.clienteNome }}</td>
          <td>{{ e.endereco }}</td>
          <td>{{ labelStatus(e.status) }}</td>
          <td>{{ formatarData(e.iniciadaEm) }}</td>
          <td>{{ formatarData(e.chegadaEm) }}</td>
          <td>{{ formatarData(e.concluidaEm) }}</td>
          <td>{{ (e.status === 'DEVOLUCAO' || e.status === 'RECUSADO' || e.status === 'INTERROMPIDA') 
          ? (e.motivoDevolucao) : '-' }}</td>
        </tr>
      </tbody>
    </table>
  `
})
export class EntregasListComponent {
  private service = inject(EntregasService);

  numeroManifesto = 'ex: 9001';
  entregas$?: Observable<Entrega[]>;

  carregar() {
    this.entregas$ = this.service.listarEntregas(this.numeroManifesto.trim());
  }

  formatarData(valor: string | null): string {
    if (!valor) return '-';
    const d = new Date(valor);
    return isNaN(d.getTime()) ? valor : d.toLocaleString('pt-BR');
  }

  private readonly statusLabel: Record<string, string> = {
  INTERROMPIDA: 'INTERROMPIDA',
  EM_TRANSITO: 'EM TRÂNSITO',
  AGUARDANDO_RECEBIMENTO: 'AGUARDANDO RECEBIMENTO',
  ENTREGUE: 'ENTREGUE',
  DEVOLUCAO: 'DEVOLUÇÃO'
};

labelStatus(status: string): string {
  return this.statusLabel[status] ?? status ?? '-';
}

}

