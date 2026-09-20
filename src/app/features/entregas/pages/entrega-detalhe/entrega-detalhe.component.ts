import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterModule
} from '@angular/router';
import { Observable } from 'rxjs';

import {
  EntregasService,
  RegistrarResultadoNotaFiscalRequest,
  RegistrarOcorrenciaEntregaRequest,
  FinalizarEntregaSemNovaTentativaRequest,
  MotivoOcorrenciaEntrega
} from '../../../../core/api/entregas.service';

import { Entrega } from '../../../../shared/models/entrega.model';

import {
  EntregaNotaFiscal,
  StatusNotaFiscal,
  MotivoDevolucao,
  MotivoNaoRealizacao
} from '../../../../shared/models/entrega-nota-fiscal.model';


type ResultadoSelecionavel =
  | 'ENTREGUE'
  | 'ENTREGUE_PARCIAL'
  | 'DEVOLVIDA'
  | 'NAO_REALIZADA';


interface FormularioResultadoNota {
  status: ResultadoSelecionavel | null;
  motivoDevolucao: MotivoDevolucao | null;
  motivoNaoRealizacao: MotivoNaoRealizacao | null;
  justificativa: string;
}


@Component({
  selector: 'app-entrega-detalhe',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './entrega-detalhe.component.html',
  styleUrls: ['./entrega-detalhe.component.scss']
})
export class EntregaDetalheComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly entregasService = inject(EntregasService);


  numeroManifesto =
    this.route.snapshot.paramMap.get('numeroManifesto')!;

  numeroEntrega =
    this.route.snapshot.paramMap.get('numeroEntrega')!;


  entrega$!: Observable<Entrega | null>;

  notasFiscais$!: Observable<EntregaNotaFiscal[]>;


  /* =====================================================
     RESULTADO DAS NOTAS FISCAIS
     ===================================================== */

  formulariosResultado:
    Record<string, FormularioResultadoNota> = {};

  salvandoNotaId: string | null = null;

  erroResultado = '';

  sucessoResultado = '';


  readonly motivosDevolucao: {
    valor: MotivoDevolucao;
    label: string;
  }[] = [
    {
      valor: 'RECUSA_CLIENTE',
      label: 'Recusa do cliente'
    },
    {
      valor: 'FALTA',
      label: 'Falta'
    },
    {
      valor: 'AVARIA',
      label: 'Avaria'
    },
    {
      valor: 'DIVERGENCIA',
      label: 'Divergência'
    },
    {
      valor: 'PRODUTO_INCORRETO',
      label: 'Produto incorreto'
    },
    {
      valor: 'OUTRO',
      label: 'Outro'
    }
  ];


  readonly motivosNaoRealizacao: {
    valor: MotivoNaoRealizacao;
    label: string;
  }[] = [
    {
      valor: 'TEMPO_INSUFICIENTE',
      label: 'Tempo insuficiente'
    },
    {
      valor: 'CLIENTE_FECHADO',
      label: 'Cliente fechado'
    },
    {
      valor: 'CLIENTE_SEM_SISTEMA',
      label: 'Cliente sem sistema'
    },
    {
      valor: 'CLIENTE_AUSENTE',
      label: 'Cliente ausente'
    },
    {
      valor: 'CLIENTE_SEM_ESPACO',
      label: 'Cliente sem espaço'
    },
    {
      valor: 'ENDERECO_NAO_LOCALIZADO',
      label: 'Endereço não localizado'
    },
    {
      valor: 'VEICULO_COM_PROBLEMA',
      label: 'Veículo com problema'
    },
    {
      valor: 'PROBLEMA_NA_CARGA',
      label: 'Problema na carga'
    },
    {
      valor: 'ROTA_INTERROMPIDA',
      label: 'Rota interrompida'
    },
    {
      valor: 'OUTRO',
      label: 'Outro'
    }
  ];


  /* =====================================================
     OCORRÊNCIA
     ===================================================== */

  formularioOcorrenciaAberto = false;

  motivoOcorrencia:
    MotivoOcorrenciaEntrega | null = null;

  observacaoOcorrencia = '';

  registrandoOcorrencia = false;

  erroOcorrencia = '';

  sucessoOcorrencia = '';


  readonly motivosOcorrencia: {
    valor: MotivoOcorrenciaEntrega;
    label: string;
  }[] = [
    {
      valor: 'CLIENTE_SEM_SISTEMA',
      label: 'Cliente sem sistema'
    },
    {
      valor: 'CLIENTE_FECHADO',
      label: 'Cliente fechado'
    },
    {
      valor: 'CLIENTE_AUSENTE',
      label: 'Cliente ausente'
    },
    {
      valor: 'CLIENTE_SEM_ESPACO',
      label: 'Cliente sem espaço'
    },
    {
      valor: 'FILA_OU_ESPERA',
      label: 'Fila ou espera'
    },
    {
      valor: 'ACESSO_BLOQUEADO',
      label: 'Acesso bloqueado'
    },
    {
      valor: 'ENDERECO_NAO_LOCALIZADO',
      label: 'Endereço não localizado'
    },
    {
      valor: 'PROBLEMA_NO_VEICULO',
      label: 'Problema no veículo'
    },
    {
      valor: 'PROBLEMA_NA_CARGA',
      label: 'Problema na carga'
    },
    {
      valor: 'DIVERGENCIA_DOCUMENTAL',
      label: 'Divergência documental'
    },
    {
      valor: 'OUTRO',
      label: 'Outro'
    }
  ];


  /* =====================================================
     FINALIZAÇÃO SEM NOVA TENTATIVA
     ===================================================== */

  formularioFinalizacaoAberto = false;

  motivoFinalizacao:
    MotivoNaoRealizacao | null = null;

  justificativaFinalizacao = '';

  finalizandoSemNovaTentativa = false;

  erroFinalizacao = '';


  constructor() {
    this.carregarEntrega();
    this.carregarNotasFiscais();
  }


  /* =====================================================
     CARREGAMENTO
     ===================================================== */

  private carregarEntrega(): void {

    this.entrega$ =
      this.entregasService.obterEntrega(
        this.numeroManifesto,
        this.numeroEntrega
      );
  }


  private carregarNotasFiscais(): void {

    this.notasFiscais$ =
      this.entregasService.listarNotasFiscais(
        this.numeroManifesto,
        this.numeroEntrega
      );
  }


  private recarregarDados(): void {

    this.carregarEntrega();
    this.carregarNotasFiscais();
  }


  voltar(): void {

    this.router.navigate([
      '/minha-rota',
      this.numeroManifesto
    ]);
  }


  /* =====================================================
     RESULTADO DA NOTA FISCAL
     ===================================================== */

  podeRegistrarResultado(
    entrega: Entrega,
    nota: EntregaNotaFiscal
  ): boolean {

    return (
      entrega.status === 'AGUARDANDO_RECEBIMENTO' &&
      nota.status === 'PENDENTE'
    );
  }


  selecionarResultado(
    nota: EntregaNotaFiscal,
    status: ResultadoSelecionavel
  ): void {

    this.erroResultado = '';
    this.sucessoResultado = '';

    this.formulariosResultado[nota.id] = {
      status,
      motivoDevolucao: null,
      motivoNaoRealizacao: null,
      justificativa: ''
    };
  }


  formularioNota(
    nota: EntregaNotaFiscal
  ): FormularioResultadoNota | null {

    return this.formulariosResultado[nota.id] || null;
  }


  cancelarResultado(
    nota: EntregaNotaFiscal
  ): void {

    delete this.formulariosResultado[nota.id];

    this.erroResultado = '';
  }


  exigeMotivoDevolucao(
    formulario: FormularioResultadoNota
  ): boolean {

    return (
      formulario.status === 'ENTREGUE_PARCIAL' ||
      formulario.status === 'DEVOLVIDA'
    );
  }


  exigeMotivoNaoRealizacao(
    formulario: FormularioResultadoNota
  ): boolean {

    return formulario.status === 'NAO_REALIZADA';
  }


  podeConfirmarResultado(
    formulario: FormularioResultadoNota
  ): boolean {

    if (!formulario.status) {
      return false;
    }

    if (
      this.exigeMotivoDevolucao(formulario) &&
      !formulario.motivoDevolucao
    ) {
      return false;
    }

    if (
      this.exigeMotivoNaoRealizacao(formulario) &&
      !formulario.motivoNaoRealizacao
    ) {
      return false;
    }

    return true;
  }


  confirmarResultado(
    nota: EntregaNotaFiscal
  ): void {

    const formulario =
      this.formulariosResultado[nota.id];

    if (
      !formulario ||
      !formulario.status
    ) {
      return;
    }

    if (!this.podeConfirmarResultado(formulario)) {

      this.erroResultado =
        'Preencha os campos obrigatórios antes de confirmar.';

      return;
    }

    const payload:
      RegistrarResultadoNotaFiscalRequest = {

      status:
        formulario.status as StatusNotaFiscal,

      motivoDevolucao:
        this.exigeMotivoDevolucao(formulario)
          ? formulario.motivoDevolucao
          : null,

      motivoNaoRealizacao:
        this.exigeMotivoNaoRealizacao(formulario)
          ? formulario.motivoNaoRealizacao
          : null,

      justificativa:
        formulario.justificativa.trim()
          ? formulario.justificativa.trim()
          : null
    };

    this.salvandoNotaId = nota.id;

    this.erroResultado = '';
    this.sucessoResultado = '';

    this.entregasService
      .registrarResultadoNotaFiscal(
        nota.id,
        payload
      )
      .subscribe({

        next: () => {

          this.salvandoNotaId = null;

          delete this.formulariosResultado[nota.id];

          this.sucessoResultado =
            `Resultado da NF ${nota.numero} registrado com sucesso.`;

          this.recarregarDados();
        },

        error: (erro) => {

          console.error(
            'Erro ao registrar resultado da NF:',
            erro
          );

          this.salvandoNotaId = null;

          this.erroResultado =
            erro?.error?.message ||
            erro?.error?.mensagem ||
            'Não foi possível registrar o resultado da nota fiscal.';
        }
      });
  }


  resultadoLabel(
    status: ResultadoSelecionavel
  ): string {

    switch (status) {

      case 'ENTREGUE':
        return 'Entregue';

      case 'ENTREGUE_PARCIAL':
        return 'Entregue parcialmente';

      case 'DEVOLVIDA':
        return 'Devolvida';

      case 'NAO_REALIZADA':
        return 'Não realizada';
    }
  }


  /* =====================================================
     OCORRÊNCIA
     ===================================================== */

  abrirFormularioOcorrencia(): void {

    this.formularioOcorrenciaAberto = true;

    this.motivoOcorrencia = null;
    this.observacaoOcorrencia = '';

    this.erroOcorrencia = '';
    this.sucessoOcorrencia = '';

    /*
     * Evita deixar um formulário de resultado de NF aberto
     * enquanto uma ocorrência está sendo registrada.
     */
    this.formulariosResultado = {};
  }


  cancelarOcorrencia(): void {

    this.formularioOcorrenciaAberto = false;

    this.motivoOcorrencia = null;
    this.observacaoOcorrencia = '';

    this.erroOcorrencia = '';
  }


  registrarOcorrencia(): void {

    if (!this.motivoOcorrencia) {

      this.erroOcorrencia =
        'Selecione o motivo da ocorrência.';

      return;
    }

    const payload:
      RegistrarOcorrenciaEntregaRequest = {

      motivo: this.motivoOcorrencia,

      observacao:
        this.observacaoOcorrencia.trim()
          ? this.observacaoOcorrencia.trim()
          : null
    };

    this.registrandoOcorrencia = true;

    this.erroOcorrencia = '';
    this.sucessoOcorrencia = '';
    this.erroResultado = '';
    this.sucessoResultado = '';

    this.entregasService
      .registrarOcorrencia(
        this.numeroManifesto,
        this.numeroEntrega,
        payload
      )
      .subscribe({

        next: () => {

          this.registrandoOcorrencia = false;

          this.formularioOcorrenciaAberto = false;

          this.motivoOcorrencia = null;
          this.observacaoOcorrencia = '';

          this.formulariosResultado = {};

          this.sucessoOcorrencia =
            'Ocorrência registrada. A entrega foi interrompida e as notas fiscais pendentes foram preservadas.';

          this.recarregarDados();
        },

        error: (erro) => {

          console.error(
            'Erro ao registrar ocorrência:',
            erro
          );

          this.registrandoOcorrencia = false;

          this.erroOcorrencia =
            erro?.error?.message ||
            erro?.error?.mensagem ||
            'Não foi possível registrar a ocorrência.';
        }
      });
  }


  /* =====================================================
     FINALIZAR SEM NOVA TENTATIVA
     ===================================================== */

  abrirFormularioFinalizacao(): void {

    this.formularioFinalizacaoAberto = true;

    this.motivoFinalizacao = null;
    this.justificativaFinalizacao = '';

    this.erroFinalizacao = '';
  }


  cancelarFinalizacao(): void {

    this.formularioFinalizacaoAberto = false;

    this.motivoFinalizacao = null;
    this.justificativaFinalizacao = '';

    this.erroFinalizacao = '';
  }


  finalizarSemNovaTentativa(): void {

    if (!this.motivoFinalizacao) {

      this.erroFinalizacao =
        'Selecione o motivo da não realização.';

      return;
    }

    const payload:
      FinalizarEntregaSemNovaTentativaRequest = {

      motivo: this.motivoFinalizacao,

      justificativa:
        this.justificativaFinalizacao.trim()
          ? this.justificativaFinalizacao.trim()
          : null
    };

    this.finalizandoSemNovaTentativa = true;

    this.erroFinalizacao = '';

    this.entregasService
      .finalizarSemNovaTentativa(
        this.numeroManifesto,
        this.numeroEntrega,
        payload
      )
      .subscribe({

        next: () => {

          this.finalizandoSemNovaTentativa = false;

          this.formularioFinalizacaoAberto = false;

          this.motivoFinalizacao = null;
          this.justificativaFinalizacao = '';

          this.sucessoOcorrencia = '';

          this.sucessoResultado =
            'Entrega finalizada sem nova tentativa. As notas fiscais pendentes foram registradas como não realizadas.';

          this.recarregarDados();
        },

        error: (erro) => {

          console.error(
            'Erro ao finalizar entrega sem nova tentativa:',
            erro
          );

          this.finalizandoSemNovaTentativa = false;

          this.erroFinalizacao =
            erro?.error?.message ||
            erro?.error?.mensagem ||
            'Não foi possível finalizar a entrega.';
        }
      });
  }


  /* =====================================================
     APRESENTAÇÃO
     ===================================================== */

  formatarData(valor: string | null): string {

    if (!valor) {
      return '-';
    }

    const data = new Date(valor);

    return isNaN(data.getTime())
      ? valor
      : data.toLocaleString('pt-BR');
  }


  pillClass(status: string): string {

    switch (status) {

      case 'CONCLUIDO':
        return 'pill--ok';

      case 'PENDENTE':
        return 'pill--neutral';

      case 'EM_TRANSITO':
        return 'pill--info';

      case 'AGUARDANDO_RECEBIMENTO':
        return 'pill--warn';

      case 'INTERROMPIDA':
        return 'pill--warn';

      case 'CONCLUIDO_COM_APONTAMENTOS':
        return 'pill--danger';

      default:
        return 'pill--neutral';
    }
  }


  statusNotaLabel(status: string): string {

    switch (status) {

      case 'PENDENTE':
        return 'Pendente';

      case 'ENTREGUE':
        return 'Entregue';

      case 'ENTREGUE_PARCIAL':
        return 'Entregue parcialmente';

      case 'DEVOLVIDA':
        return 'Devolvida';

      case 'NAO_REALIZADA':
        return 'Não realizada';

      default:
        return status;
    }
  }


  pillNotaClass(status: string): string {

    switch (status) {

      case 'ENTREGUE':
        return 'pill--ok';

      case 'PENDENTE':
        return 'pill--neutral';

      case 'ENTREGUE_PARCIAL':
        return 'pill--warn';

      case 'DEVOLVIDA':
      case 'NAO_REALIZADA':
        return 'pill--danger';

      default:
        return 'pill--neutral';
    }
  }
}