import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { UsuariosService, UsuarioResponse } from './usuarios.service';
import { RouterLink } from '@angular/router'; 
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent implements OnInit {
  private readonly usuariosService = inject(UsuariosService);

  usuarios = signal<UsuarioResponse[]>([]);
  carregando = signal(false);
  erro = signal('');

  ngOnInit(): void {
    this.carregarUsuarios();
  }

  carregarUsuarios(): void {
    this.carregando.set(true);
    this.erro.set('');

    this.usuariosService.listarUsuarios().subscribe({
      next: (res) => {
        this.usuarios.set(res);
        this.carregando.set(false);
      },
      error: () => {
        this.erro.set('Não foi possível carregar os usuários.');
        this.carregando.set(false);
      }
    });
  }

  statusLabel(usuario: UsuarioResponse): string {
    return usuario.ativo ? 'Ativo' : 'Inativo';
  }

  statusClass(usuario: UsuarioResponse): string {
    return usuario.ativo ? 'pill--ok' : 'pill--danger';
  }

  ativar(usuario: UsuarioResponse): void {
  if (!confirm(`Deseja ativar o usuário ${usuario.nome}?`)) {
    return;
  }

  this.usuariosService.ativarUsuario(usuario.cpf).subscribe({
    next: () => this.carregarUsuarios(),
    error: (err) => {
      this.erro.set(err?.error?.message || 'Não foi possível ativar o usuário.');
    }
  });
  }

  inativar(usuario: UsuarioResponse): void {
    if (!confirm(`Deseja inativar o usuário ${usuario.nome}?`)) {
      return;
    }

    this.usuariosService.inativarUsuario(usuario.cpf).subscribe({
      next: () => this.carregarUsuarios(),
      error: (err) => {
        this.erro.set(err?.error?.message || 'Não foi possível inativar o usuário.');
      }
    });
  }

    resetarSenha(usuario: UsuarioResponse): void {
    const novaSenha = prompt(`Informe a nova senha para ${usuario.nome}:`);

    if (!novaSenha) {
      return;
    }

    if (novaSenha.length < 6) {
      this.erro.set('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (!confirm(`Confirma resetar a senha do usuário ${usuario.nome}?`)) {
      return;
    }

    this.usuariosService.resetarSenha(usuario.cpf, { novaSenha }).subscribe({
      next: () => {
        alert('Senha resetada com sucesso.');
        this.carregarUsuarios();
      },
      error: (err) => {
        this.erro.set(err?.error?.message || 'Não foi possível resetar a senha.');
      }
    });
  }
  filtroTexto = signal('');
  filtroRole = signal<'TODOS' | 'ADMIN' | 'OPERADOR' | 'MOTORISTA'>('TODOS');
  filtroStatus = signal<'TODOS' | 'ATIVO' | 'INATIVO'>('TODOS');

  ordenarPor = signal<'nome' | 'cpf' | 'email' | 'telefone' | 'role' | 'ativo'>('nome');
  ordenarDirecao = signal<'asc' | 'desc'>('asc');

usuariosFiltrados = computed(() => {
  const busca = this.filtroTexto().trim().toLowerCase();
  const buscaNumerica = busca.replace(/\D/g, '');

  let lista = [...this.usuarios()];

  if (busca) {
    lista = lista.filter(u => {
      const nome = (u.nome ?? '').toLowerCase();
      const email = (u.email ?? '').toLowerCase();
      const telefone = (u.telefone ?? '').replace(/\D/g, '');
      const cpf = (u.cpf ?? '').replace(/\D/g, '');

      const encontrouTexto =
        nome.includes(busca) ||
        email.includes(busca);

      const encontrouNumero =
        buscaNumerica.length > 0 &&
        (cpf.includes(buscaNumerica) || telefone.includes(buscaNumerica));

      return encontrouTexto || encontrouNumero;
    });
  }

  if (this.filtroRole() !== 'TODOS') {
    lista = lista.filter(u => u.role === this.filtroRole());
  }

  if (this.filtroStatus() === 'ATIVO') {
    lista = lista.filter(u => u.ativo);
  }

  if (this.filtroStatus() === 'INATIVO') {
    lista = lista.filter(u => !u.ativo);
  }

  const campo = this.ordenarPor();
  const direcao = this.ordenarDirecao();

  return lista.sort((a, b) => {
    const valorA = String(a[campo] ?? '').toLowerCase();
    const valorB = String(b[campo] ?? '').toLowerCase();

    if (valorA < valorB) return direcao === 'asc' ? -1 : 1;
    if (valorA > valorB) return direcao === 'asc' ? 1 : -1;
    return 0;
  });
});

ordenar(campo: 'nome' | 'cpf' | 'email' | 'telefone' | 'role' | 'ativo'): void {
    if (this.ordenarPor() === campo) {
      this.ordenarDirecao.set(this.ordenarDirecao() === 'asc' ? 'desc' : 'asc');
      return;
    }

    this.ordenarPor.set(campo);
    this.ordenarDirecao.set('asc');
  }

  iconeOrdenacao(campo: 'nome' | 'cpf' | 'email' | 'telefone' | 'role' | 'ativo'): string {
    if (this.ordenarPor() !== campo) {
      return '↕';
    }

    return this.ordenarDirecao() === 'asc' ? '↑' : '↓';
  }

  limparFiltros(): void {
    this.filtroTexto.set('');
    this.filtroRole.set('TODOS');
    this.filtroStatus.set('TODOS');
    this.ordenarPor.set('nome');
    this.ordenarDirecao.set('asc');
  }

}