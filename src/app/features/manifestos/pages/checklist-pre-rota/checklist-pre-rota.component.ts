import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ManifestoService } from '../../../../core/api/manifesto.service';

import { ChecklistPreRotaService } from '../../../../core/api/checklist-pre-rota.service';
import {
  ChecklistPreRotaRequest,
  ChecklistPreRotaResponse
} from '../../../../shared/models/checklist-pre-rota.model';

@Component({
  selector: 'app-checklist-pre-rota',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './checklist-pre-rota.component.html',
  styleUrl: './checklist-pre-rota.component.scss'
})
export class ChecklistPreRotaComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly checklistService = inject(ChecklistPreRotaService);
  private readonly manifestoService = inject(ManifestoService);

  numeroManifesto =
    Number(
      this.route.snapshot.paramMap.get('numeroManifesto')
    );

  carregando = true;
  salvando = false;
  concluindo = false;
  liberando = false;
  statusManifesto: string | null = null;

  erro = '';
  sucesso = '';

  checklist: ChecklistPreRotaResponse | null = null;

  form: ChecklistPreRotaRequest = {
    temperaturaCarga: null,
    quilometragem: null,
    nivelCombustivel: null,

    pneusOk: null,
    luzesOk: null,
    documentacaoOk: null,
    equipamentoRefrigeracaoOk: null,
    cargaConferida: null,

    observacao: null

  };

  constructor() {
    this.carregar();
    this.carregarStatusManifesto();
  }

  carregar(): void {
    this.carregando = true;
    this.erro = '';

    this.checklistService
      .buscar(this.numeroManifesto)
      .subscribe({
        next: (checklist) => {
          this.checklist = checklist;

          this.form = {
            temperaturaCarga: checklist.temperaturaCarga,
            quilometragem: checklist.quilometragem,
            nivelCombustivel: checklist.nivelCombustivel,

            pneusOk: checklist.pneusOk,
            luzesOk: checklist.luzesOk,
            documentacaoOk: checklist.documentacaoOk,
            equipamentoRefrigeracaoOk:
              checklist.equipamentoRefrigeracaoOk,
            cargaConferida: checklist.cargaConferida,

            observacao: checklist.observacao
          };

          this.carregando = false;
        },

        error: (erro) => {
          console.error(
            'Erro ao carregar checklist:',
            erro
          );

          /*
           * Checklist ainda não criado:
           * a tela continua disponível para preenchimento.
           */
          if (erro.status === 404) {
            this.checklist = null;
            this.carregando = false;
            return;
          }

          this.erro =
            'Não foi possível carregar o checklist deste manifesto.';

          this.carregando = false;
        }
      });
  }

  salvar(): void {
    if (this.salvando) {
      return;
    }

    this.salvando = true;
    this.erro = '';
    this.sucesso = '';

    this.checklistService
      .salvar(
        this.numeroManifesto,
        this.form
      )
      .subscribe({
        next: (checklist) => {
          this.checklist = checklist;
          this.salvando = false;

          this.sucesso =
            'Checklist salvo com sucesso.';
        },

        error: (erro) => {
          console.error(
            'Erro ao salvar checklist:',
            erro
          );

          this.erro =
            'Não foi possível salvar o checklist.';

          this.salvando = false;
        }
      });
  }

  concluir(): void {
    if (this.concluindo) {
      return;
    }

    this.concluindo = true;
    this.erro = '';
    this.sucesso = '';

    this.checklistService
      .concluir(this.numeroManifesto)
      .subscribe({
        next: (checklist) => {
          this.checklist = checklist;
          this.concluindo = false;

          this.sucesso =
            'Checklist concluído com sucesso.';
        },

        error: (erro) => {
          console.error(
            'Erro ao concluir checklist:',
            erro
          );

          this.erro =
            erro.error?.message ||
            erro.error?.mensagem ||
            'Não foi possível concluir o checklist.';

          this.concluindo = false;
        }
      });
  }

  liberarRota(): void {
    if (this.liberando) {
      return;
    }

    this.liberando = true;
    this.erro = '';
    this.sucesso = '';

    this.manifestoService
      .liberarRota(this.numeroManifesto)
      .subscribe({
        next: () => {
          this.liberando = false;
          this.statusManifesto = 'LIBERADO';
          this.sucesso = 'Rota liberada com sucesso.';
        },

        error: (erro) => {
          console.error(
            'Erro ao liberar rota:',
            erro
          );

          this.erro =
            erro.error?.message ||
            erro.error?.mensagem ||
            'Não foi possível liberar a rota.';

          this.liberando = false;
        }
      });
  }

  carregarStatusManifesto(): void {
    this.manifestoService
      .buscar(this.numeroManifesto)
      .subscribe({
        next: (manifesto) => {
          this.statusManifesto = manifesto.status;
        },

        error: (erro) => {
          console.error(
            'Erro ao carregar status do manifesto:',
            erro
          );
        }
      });
  }
  voltar(): void {
    this.router.navigate(
      ['/manifestos'],
      {
        queryParams: {
          numero: this.numeroManifesto
        }
      }
    );
  }
}