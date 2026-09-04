import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { VeiculosService } from './veiculos.service';
import { Veiculo } from '../../shared/models/veiculo.model';

@Component({
  selector: 'app-veiculos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './veiculos.component.html',
  styleUrl: './veiculos.component.scss'
})
export class VeiculosComponent implements OnInit {

  private readonly veiculosService = inject(VeiculosService);

  veiculos = signal<Veiculo[]>([]);
  carregando = signal(false);
  erro = signal('');

  filtroTexto = signal('');
  filtroStatus = signal<'TODOS' | 'ATIVO' | 'INATIVO'>('TODOS');
  filtroRefrigerado = signal<'TODOS' | 'SIM' | 'NAO'>('TODOS');

  ordenarPor = signal<
    'placa' |
    'marca' |
    'modelo' |
    'ano' |
    'tipoVeiculo' |
    'capacidadeKg' |
    'refrigerado' |
    'ativo'
  >('placa');

  ordenarDirecao = signal<'asc' | 'desc'>('asc');

  ngOnInit(): void {
    this.carregarVeiculos();
  }

  carregarVeiculos(): void {
    this.carregando.set(true);
    this.erro.set('');

    this.veiculosService.listar().subscribe({
      next: (res) => {
        this.veiculos.set(res);
        this.carregando.set(false);
      },
      error: (err) => {
        this.erro.set(
          err?.error?.message ||
          'Não foi possível carregar os veículos.'
        );

        this.carregando.set(false);
      }
    });
  }

  veiculosFiltrados = computed(() => {

    const busca = this.filtroTexto()
      .trim()
      .toLowerCase();

    let lista = [...this.veiculos()];

    if (busca) {
      lista = lista.filter(v => {

        const placa = (v.placa ?? '').toLowerCase();
        const marca = (v.marca ?? '').toLowerCase();
        const modelo = (v.modelo ?? '').toLowerCase();
        const tipo = (v.tipoVeiculo ?? '').toLowerCase();

        return (
          placa.includes(busca) ||
          marca.includes(busca) ||
          modelo.includes(busca) ||
          tipo.includes(busca)
        );
      });
    }

    if (this.filtroStatus() === 'ATIVO') {
      lista = lista.filter(v => v.ativo);
    }

    if (this.filtroStatus() === 'INATIVO') {
      lista = lista.filter(v => !v.ativo);
    }

    if (this.filtroRefrigerado() === 'SIM') {
      lista = lista.filter(v => v.refrigerado);
    }

    if (this.filtroRefrigerado() === 'NAO') {
      lista = lista.filter(v => !v.refrigerado);
    }

    const campo = this.ordenarPor();
    const direcao = this.ordenarDirecao();

    return lista.sort((a, b) => {

      const valorA = a[campo];
      const valorB = b[campo];

      if (valorA == null && valorB == null) return 0;
      if (valorA == null) return direcao === 'asc' ? -1 : 1;
      if (valorB == null) return direcao === 'asc' ? 1 : -1;

      if (typeof valorA === 'number' && typeof valorB === 'number') {
        return direcao === 'asc'
          ? valorA - valorB
          : valorB - valorA;
      }

      const strA = String(valorA).toLowerCase();
      const strB = String(valorB).toLowerCase();

      if (strA < strB) return direcao === 'asc' ? -1 : 1;
      if (strA > strB) return direcao === 'asc' ? 1 : -1;

      return 0;
    });
  });

  ordenar(
    campo:
      'placa' |
      'marca' |
      'modelo' |
      'ano' |
      'tipoVeiculo' |
      'capacidadeKg' |
      'refrigerado' |
      'ativo'
  ): void {

    if (this.ordenarPor() === campo) {
      this.ordenarDirecao.set(
        this.ordenarDirecao() === 'asc' ? 'desc' : 'asc'
      );

      return;
    }

    this.ordenarPor.set(campo);
    this.ordenarDirecao.set('asc');
  }

  iconeOrdenacao(
    campo:
      'placa' |
      'marca' |
      'modelo' |
      'ano' |
      'tipoVeiculo' |
      'capacidadeKg' |
      'refrigerado' |
      'ativo'
  ): string {

    if (this.ordenarPor() !== campo) {
      return '↕';
    }

    return this.ordenarDirecao() === 'asc'
      ? '↑'
      : '↓';
  }

  statusLabel(veiculo: Veiculo): string {
    return veiculo.ativo ? 'Ativo' : 'Inativo';
  }

  statusClass(veiculo: Veiculo): string {
    return veiculo.ativo
      ? 'pill--ok'
      : 'pill--danger';
  }

  refrigeradoLabel(veiculo: Veiculo): string {
    return veiculo.refrigerado
      ? 'Sim'
      : 'Não';
  }

  ativar(veiculo: Veiculo): void {

    if (!confirm(
      `Deseja ativar o veículo ${veiculo.placa}?`
    )) {
      return;
    }

    this.veiculosService.ativar(veiculo.id).subscribe({
      next: () => this.carregarVeiculos(),

      error: (err) => {
        this.erro.set(
          err?.error?.message ||
          'Não foi possível ativar o veículo.'
        );
      }
    });
  }

  inativar(veiculo: Veiculo): void {

    if (!confirm(
      `Deseja inativar o veículo ${veiculo.placa}?`
    )) {
      return;
    }

    this.veiculosService.inativar(veiculo.id).subscribe({
      next: () => this.carregarVeiculos(),

      error: (err) => {
        this.erro.set(
          err?.error?.message ||
          'Não foi possível inativar o veículo.'
        );
      }
    });
  }

  limparFiltros(): void {
    this.filtroTexto.set('');
    this.filtroStatus.set('TODOS');
    this.filtroRefrigerado.set('TODOS');
    this.ordenarPor.set('placa');
    this.ordenarDirecao.set('asc');
  }
}