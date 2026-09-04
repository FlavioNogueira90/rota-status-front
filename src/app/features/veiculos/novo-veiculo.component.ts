import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { VeiculosService } from './veiculos.service';
import {
  CriarVeiculoRequest,
  TipoVeiculo
} from '../../shared/models/veiculo.model';

@Component({
  selector: 'app-novo-veiculo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './novo-veiculo.component.html',
  styleUrl: './novo-veiculo.component.scss'
})
export class NovoVeiculoComponent {

  private readonly veiculosService = inject(VeiculosService);
  private readonly router = inject(Router);

  salvando = signal(false);
  erro = signal('');
  sucesso = signal('');

  tiposVeiculo: { valor: TipoVeiculo; descricao: string }[] = [
    { valor: 'UTILITARIO', descricao: 'Utilitário' },
    { valor: 'FURGAO', descricao: 'Furgão' },
    { valor: 'VUC', descricao: 'VUC' },
    { valor: 'CAMINHAO', descricao: 'Caminhão' },
    { valor: 'CARRETA', descricao: 'Carreta' },
    { valor: 'OUTRO', descricao: 'Outro' }
  ];

  form: CriarVeiculoRequest = {
    placa: '',
    marca: '',
    modelo: '',
    ano: null,
    tipoVeiculo: 'UTILITARIO',
    capacidadeKg: null,
    refrigerado: false
  };

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

    const request: CriarVeiculoRequest = {
      ...this.form,
      placa
    };

    this.veiculosService.criar(request).subscribe({
      next: () => {
        this.sucesso.set('Veículo cadastrado com sucesso.');
        this.salvando.set(false);

        setTimeout(() => {
          this.router.navigate(['/veiculos']);
        }, 700);
      },

      error: (err) => {
        this.erro.set(
          err?.error?.message ||
          'Não foi possível cadastrar o veículo.'
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