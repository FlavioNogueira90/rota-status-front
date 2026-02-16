import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { EntregasService } from '../../../../core/api/entregas.service';
import { Entrega } from '../../../../shared/models/entrega.model';

@Component({
  selector: 'app-entrega-detalhe',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './entrega-detalhe.component.html',
  styleUrls: ['./entrega-detalhe.component.scss']
})
export class EntregaDetalheComponent {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private entregasService = inject(EntregasService);

  numeroManifesto = this.route.snapshot.paramMap.get('numeroManifesto')!;
  numeroEntrega = this.route.snapshot.paramMap.get('numeroEntrega')!;

  entrega$: Observable<Entrega | null> =
    this.entregasService.obterEntrega(this.numeroManifesto, this.numeroEntrega);

  voltar() {
    this.router.navigate(['/manifestos'], { queryParams: { numero: this.numeroManifesto } });
  }

  formatarData(valor: string | null): string {
    if (!valor) return '-';
    const d = new Date(valor);
    return isNaN(d.getTime()) ? valor : d.toLocaleString('pt-BR');
  }

  pillClass(status: string): string {
    switch (status) {
      case 'ENTREGUE': return 'pill--ok';
      case 'PENDENTE': return 'pill--neutral';
      case 'EM_TRANSITO': return 'pill--info';
      case 'AGUARDANDO_RECEBIMENTO': return 'pill--warn';
      case 'DEVOLUCAO':
      case 'RECUSADO': return 'pill--danger';
      case 'INTERROMPIDA':
      case 'INTERROMPIDO': return 'pill--warn';
      default: return 'pill--neutral';
    }
  }
}
