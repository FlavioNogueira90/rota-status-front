import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import { VeiculosService } from '../../../veiculos/veiculos.service';
import { Veiculo } from '../../../../shared/models/veiculo.model';

import {
  ManifestoService,
  NovoManifestoRequest
} from '../../../../core/api/manifesto.service';

import {
  UsuariosService,
  MotoristaOption
} from '../../../usuarios/usuarios.service';

@Component({
  selector: 'app-novo-manifesto',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule
  ],
  templateUrl: './novo-manifesto.component.html',
  styleUrls: ['./novo-manifesto.component.scss']
})
export class NovoManifestoComponent {

  private service = inject(ManifestoService);
  private usuariosService = inject(UsuariosService);
  private veiculosService = inject(VeiculosService);
  private router = inject(Router);

  salvando = false;
  erro: string | null = null;
  sucesso: string | null = null;

  /* =========================
     MOTORISTA
     ========================= */

  termoMotorista = '';
  buscandoMotoristas = false;

  motoristasEncontrados: MotoristaOption[] = [];
  motoristaSelecionado: MotoristaOption | null = null;

  /* =========================
    VEÍCULO
    ========================= */

  termoVeiculo = '';
  buscandoVeiculos = false;

  veiculosEncontrados: Veiculo[] = [];
  veiculoSelecionado: Veiculo | null = null;

  /* =========================
     FORMULÁRIO
     ========================= */

  form: NovoManifestoRequest = {
    numeroManifesto: 0,
    motoristaId: null,
    veiculoId: null,
    entregas: [
      {
        numero: 1,
        clienteNome: '',
        endereco: ''
      }
    ]
  };

  /* =========================
     BUSCA MOTORISTA
     ========================= */

  buscarMotoristas() {

    this.motoristaSelecionado = null;
    this.form.motoristaId = null;

    const termo = this.termoMotorista.trim();

    if (!termo) {
      this.motoristasEncontrados = [];
      return;
    }

    this.buscandoMotoristas = true;

    this.usuariosService
      .buscarMotoristas(termo)
      .pipe(
        finalize(() => {
          this.buscandoMotoristas = false;
        })
      )
      .subscribe({
        next: motoristas => {
          this.motoristasEncontrados = motoristas;
        },

        error: err => {
          console.error(err);
          this.motoristasEncontrados = [];
        }
      });
  }

  selecionarMotorista(motorista: MotoristaOption) {

    this.motoristaSelecionado = motorista;

    this.form.motoristaId = motorista.id;

    this.termoMotorista = motorista.nome;

    this.motoristasEncontrados = [];
  }

  limparMotorista() {

    this.motoristaSelecionado = null;

    this.form.motoristaId = null;

    this.termoMotorista = '';

    this.motoristasEncontrados = [];
  }

  /* =========================
   BUSCA VEÍCULO
   ========================= */

  buscarVeiculos() {

    this.veiculoSelecionado = null;
    this.form.veiculoId = null;

    const termo = this.termoVeiculo.trim();

    if (!termo) {
      this.veiculosEncontrados = [];
      return;
    }

    this.buscandoVeiculos = true;

    this.veiculosService
      .buscarPorPlacaParcial(termo)
      .pipe(
        finalize(() => {
          this.buscandoVeiculos = false;
        })
      )
      .subscribe({
        next: veiculos => {
          // Segunda proteção: só oferecemos veículo ativo
          this.veiculosEncontrados =
            veiculos.filter(v => v.ativo);
        },

        error: err => {
          console.error(err);
          this.veiculosEncontrados = [];
        }
      });
  }

  selecionarVeiculo(veiculo: Veiculo) {

    this.veiculoSelecionado = veiculo;

    // O usuário vê a placa/modelo,
    // mas o manifesto guarda somente a FK.
    this.form.veiculoId = veiculo.id;

    this.termoVeiculo = veiculo.placa;

    this.veiculosEncontrados = [];
  }

  limparVeiculo() {

    this.veiculoSelecionado = null;

    this.form.veiculoId = null;

    this.termoVeiculo = '';

    this.veiculosEncontrados = [];
  }

  /* =========================
     ENTREGAS
     ========================= */

  adicionarEntrega() {

    const proximoNumero =
      (
        this.form.entregas?.length
          ? Math.max(
              ...this.form.entregas.map(e => e.numero)
            )
          : 0
      ) + 1;

    this.form.entregas.push({
      numero: proximoNumero,
      clienteNome: '',
      endereco: ''
    });
  }

  removerEntrega(i: number) {

    if (this.form.entregas.length <= 1) {
      return;
    }

    this.form.entregas.splice(i, 1);
  }

  /* =========================
     VALIDAÇÃO
     ========================= */

  validar(): string | null {

    if (
      !this.form.numeroManifesto ||
      this.form.numeroManifesto <= 0
    ) {
      return 'Informe um número de manifesto válido.';
    }

    if (!this.form.motoristaId) {
      return 'Selecione um motorista.';
    }

    // O veículo será implementado na próxima etapa.
    if (!this.form.veiculoId) {
      return 'Selecione um veículo.';
    }

    if (!this.form.entregas?.length) {
      return 'Adicione pelo menos uma entrega.';
    }

    for (const e of this.form.entregas) {

      if (!e.numero || e.numero <= 0) {
        return 'Cada entrega deve ter um número válido.';
      }

      if (!e.clienteNome.trim()) {
        return `Entrega ${e.numero}: informe o cliente.`;
      }

      if (!e.endereco.trim()) {
        return `Entrega ${e.numero}: informe o endereço.`;
      }
    }

    const nums =
      this.form.entregas.map(e => e.numero);

    const hasDup =
      new Set(nums).size !== nums.length;

    if (hasDup) {
      return 'Existe entrega com número duplicado. Ajuste os números.';
    }

    return null;
  }

  /* =========================
     SALVAR
     ========================= */

  salvar() {

    this.erro = null;
    this.sucesso = null;

    const msg = this.validar();

    if (msg) {
      this.erro = msg;
      return;
    }

    this.salvando = true;

    this.service
      .criarNovoManifesto(this.form)
      .pipe(
        finalize(() => {
          this.salvando = false;
        })
      )
      .subscribe({

        next: manifestoCriado => {

          this.sucesso =
            `Manifesto #${manifestoCriado.numeroManifesto} criado com sucesso!`;

          this.router.navigate(
            ['/manifestos'],
            {
              queryParams: {
                numero:
                  manifestoCriado.numeroManifesto
              }
            }
          );
        },

        error: err => {

          this.erro =
            err?.error?.message ??
            'Falha ao criar manifesto. Verifique os dados e tente novamente.';

          console.error(err);
        }
      });
  }
}