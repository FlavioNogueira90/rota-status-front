import { CommonModule } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AtualizarUsuarioRequest,
  UsuarioRole,
  UsuariosService
} from './usuarios.service';

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-usuario.component.html',
  styleUrl: './editar-usuario.component.scss'
})
export class EditarUsuarioComponent implements OnInit {
  private readonly usuariosService = inject(UsuariosService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  id!: number;

  carregando = signal(false);
  salvando = signal(false);
  erro = signal('');
  sucesso = signal('');

  cpf = '';
  ativo = true;

  form: AtualizarUsuarioRequest = {
    nome: '',
    email: '',
    telefone: '',
    role: 'MOTORISTA'
  };

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (!this.id) {
      this.erro.set('Usuário inválido.');
      return;
    }

    this.carregarUsuario();
  }

  carregarUsuario(): void {
    this.carregando.set(true);
    this.erro.set('');

    this.usuariosService.buscarPorId(this.id).subscribe({
      next: (usuario) => {
        this.cpf = usuario.cpf;
        this.ativo = usuario.ativo;

        this.form = {
          nome: usuario.nome,
          email: usuario.email,
          telefone: usuario.telefone,
          role: usuario.role
        };

        this.carregando.set(false);
      },
      error: (err) => {
        this.erro.set(err?.error?.message || 'Não foi possível carregar o usuário.');
        this.carregando.set(false);
      }
    });
  }

  salvar(): void {
    this.erro.set('');
    this.sucesso.set('');

    if (!this.form.nome || !this.form.role) {
      this.erro.set('Preencha nome e perfil.');
      return;
    }

    this.salvando.set(true);

    const request: AtualizarUsuarioRequest = {
      ...this.form,
      telefone: this.form.telefone?.replace(/\D/g, '') ?? ''
    };

    this.usuariosService.atualizarUsuario(this.id, request).subscribe({
      next: () => {
        this.sucesso.set('Usuário atualizado com sucesso.');
        this.salvando.set(false);

        setTimeout(() => {
          this.router.navigate(['/usuarios']);
        }, 700);
      },
      error: (err) => {
        this.erro.set(err?.error?.message || 'Não foi possível atualizar o usuário.');
        this.salvando.set(false);
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/usuarios']);
  }
}