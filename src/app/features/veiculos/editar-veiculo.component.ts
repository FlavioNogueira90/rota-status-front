import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { VeiculosService } from './veiculos.service';
import {
  AtualizarVeiculoRequest,
  TipoVeiculo
} from '../../shared/models/veiculo.model';

@Component({
  selector: 'app-editar-veiculo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-veiculo.component.html',
  styleUrl: './editar-veiculo.component.scss'
})
export class EditarVeiculoComponent implements OnInit {

  private readonly veiculosService = inject(VeiculosService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  id!: number;

  carregando = signal(false);
  salvando = signal(false);
  erro = signal('');
  sucesso = signal('');

  ativo = true;

  tiposVeiculo: { valor: TipoVeiculo; descricao: string }[] = [
    { valor: 'UTILITARIO', descricao: 'Utilitário' },
    { valor: 'FURGAO', descricao: 'Furgão' },
    { valor: 'VUC', descricao: 'VUC' },
    { valor: 'CAMINHAO', descricao: 'Caminhão' },
    { valor: 'CARRETA', descricao: 'Carreta' },
    { valor: 'OUTRO', descricao: 'Outro' }
  ];

  form: AtualizarVeiculoRequest = {
    placa: '',
    marca: '',
    modelo: '',
    ano: null,
    tipoVeiculo: 'UTILITARIO',
    capacidadeKg: null,
    refrigerado: false
  };

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.id) {
      this.erro.set('Veículo inválido.');
      return;
    }

    this.carregarVeiculo();
  }

  carregarVeiculo(): void {
    this.carregando.set(true);
    this.erro.set('');

    this.veiculosService.buscarPorId(this.id).subscribe({
      next: (veiculo) => {

        this.ativo = veiculo.ativo;

        this.form = {
          placa: veiculo.placa,
          marca: veiculo.marca,
          modelo: veiculo.modelo,
          ano: veiculo.ano,
          tipoVeiculo: veiculo.tipoVeiculo,
          capacidadeKg: veiculo.capacidadeKg,
          refrigerado: veiculo.refrigerado
        };

        this.carregando.set(false);
      },

      error: (err) => {
        this.erro.set(
          err?.error?.message ||
          'Não foi possível carregar o veículo.'
        );

        this.carregando.set(false);
      }
    });
  }

  salvar(): void {
    this.erro.set('');
    this.sucesso.set('');

    if (
      !this.form.placa ||
      !this.form.marca ||
      !this.form.modelo ||
      !this.form.tipoVeiculo
    ) {
      this.erro.set(
        'Preencha placa, marca, modelo e tipo do veículo.'
      );
      return;
    }

    const placa = this.form.placa
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase();

    if (placa.length !== 7) {
      this.erro.set('Informe uma placa válida.');
      return;
    }

    this.salvando.set(true);

    const request: AtualizarVeiculoRequest = {
      ...this.form,
      placa
    };

    this.veiculosService.atualizar(this.id, request).subscribe({
      next: () => {

        this.sucesso.set(
          'Veículo atualizado com sucesso.'
        );

        this.salvando.set(false);

        setTimeout(() => {
          this.router.navigate(['/veiculos']);
        }, 700);
      },

      error: (err) => {

        this.erro.set(
          err?.error?.message ||
          'Não foi possível atualizar o veículo.'
        );

        this.salvando.set(false);
      }
    });
  }

  formatarPlaca(): void {
    this.form.placa = this.form.placa
      .replace(/[^a-zA-Z0-9]/g, '')
      .toUpperCase()
      .slice(0, 7);
  }

  voltar(): void {
    this.router.navigate(['/veiculos']);
  }
}