import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ManifestoService } from '../../../../core/api/manifesto.service';
import { EntregasService } from '../../../../core/api/entregas.service';
import { Manifesto } from '../../../../shared/models/manifesto.model';
import { Entrega } from '../../../../shared/models/entrega.model';
import { ActivatedRoute } from '@angular/router';
import { filter, distinctUntilChanged, map } from 'rxjs/operators';


@Component({
  selector: 'app-manifesto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manifesto.component.html',
  styleUrls: ['./manifesto.component.scss']
})
export class ManifestoComponent implements OnInit {
  private manifestoService = inject(ManifestoService);
  private entregasService = inject(EntregasService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);


  numeroManifesto = '9100';
  manifesto$?: Observable<Manifesto>;
  entregas$?: Observable<Entrega[]>;
  erro: string | null = null;

  ngOnInit() {
  this.route.queryParamMap
    .pipe(
      map(params => (params.get('numero') || '').trim()),
      distinctUntilChanged(),
      filter(numero => !!numero)
    )
    .subscribe(numero => {
      this.numeroManifesto = numero;
      this.carregar();
    });
  }


  carregar() {
    this.erro = null;
    const n = this.numeroManifesto.trim();

    if (!n) {
      this.erro = 'Informe o número do manifesto.';
      return;
    }

    this.manifesto$ = this.manifestoService.buscar(n);
    this.entregas$ = this.entregasService.listarEntregas(n);
  }

  abrirDetalhe(entrega: Entrega) {
    this.router.navigate(['/manifestos', this.numeroManifesto.trim(), 'entregas', entrega.numero]);
  }

  formatarData(valor: string | null): string {
    if (!valor) return '-';
    const d = new Date(valor);
    return isNaN(d.getTime()) ? valor : d.toLocaleString('pt-BR');
  }

badgeClass(status: string): string {
  switch (status) {
    case 'CONCLUIDO': return 'badge--ok';
    case 'PENDENTE': return 'badge--neutral';
    case 'EM_TRANSITO': return 'badge--info';
    case 'AGUARDANDO_RECEBIMENTO': return 'badge--warn';
    case 'DEVOLUCAO':
    case 'RECUSADO': return 'badge--danger';
    case 'INTERROMPIDO':
    case 'INTERROMPIDA': return 'badge--warn';
    default: return 'badge--neutral';
  }
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
