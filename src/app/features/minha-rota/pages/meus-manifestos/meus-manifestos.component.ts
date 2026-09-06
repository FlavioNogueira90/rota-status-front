import { Router } from '@angular/router';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManifestoService } from '../../../../core/api/manifesto.service';
import { Manifesto } from '../../../../shared/models/manifesto.model';

@Component({
  selector: 'app-meus-manifestos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './meus-manifestos.component.html',
  styleUrl: './meus-manifestos.component.scss'
})
export class MeusManifestosComponent {

  private readonly manifestoService = inject(ManifestoService);
  private readonly router = inject(Router);

  manifestos: Manifesto[] = [];
  carregando = true;
  erro = '';
  iniciandoManifesto: number | null = null;

  constructor() {
    this.carregar();
  }

  carregar(): void {
    this.carregando = true;
    this.erro = '';

    this.manifestoService
      .listarMeusManifestos()
      .subscribe({
        next: (manifestos) => {
          this.manifestos = manifestos;
          this.carregando = false;
        },

        error: (erro) => {
          console.error(
            'Erro ao carregar manifestos do motorista:',
            erro
          );

          this.erro =
            'Não foi possível carregar seus manifestos.';

          this.carregando = false;
        }
      });
  }

  iniciarJornada(manifesto: Manifesto): void {
    if (this.iniciandoManifesto !== null) {
      return;
    }

    this.iniciandoManifesto =
      manifesto.numeroManifesto;

    this.manifestoService
      .iniciarJornada(manifesto.numeroManifesto)
      .subscribe({
        next: (execucaoId) => {
          console.log(
            'Jornada iniciada:',
            execucaoId
          );

          this.iniciandoManifesto = null;

          /*
           * Recarrega os manifestos para que
           * o card passe de LIBERADO para
           * EM_EXECUCAO.
           */
          this.carregar();
        },

        error: (erro) => {
          console.error(
            'Erro ao iniciar jornada:',
            erro
          );

          this.iniciandoManifesto = null;
        }
      });
  }

  statusLabel(status: string): string {
    switch (status) {

      case 'AGUARDANDO_CARREGAMENTO':
        return 'Aguardando liberação';

      case 'LIBERADO':
        return 'Liberado para saída';

      case 'EM_EXECUCAO':
        return 'Rota em andamento';

      case 'CONCLUIDO':
        return 'Concluído';

      default:
        return status;
    }
  }

  statusClass(status: string): string {
    switch (status) {

      case 'AGUARDANDO_CARREGAMENTO':
        return 'status--aguardando';

      case 'LIBERADO':
        return 'status--liberado';

      case 'EM_EXECUCAO':
        return 'status--execucao';

      case 'CONCLUIDO':
        return 'status--concluido';

      default:
        return '';
    }
  }

  get ativos(): Manifesto[] {
    return this.manifestos.filter(
      manifesto =>
        manifesto.status !== 'CONCLUIDO'
    );
  }

  get concluidos(): Manifesto[] {
    return this.manifestos.filter(
      manifesto =>
        manifesto.status === 'CONCLUIDO'
    );
  }
  
  continuarRota(manifesto: Manifesto): void {
    this.router.navigate([
      '/minha-rota',
      manifesto.numeroManifesto
    ]);
  }
}