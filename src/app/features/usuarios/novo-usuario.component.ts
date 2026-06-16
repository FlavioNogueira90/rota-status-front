import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CriarUsuarioRequest, UsuarioRole, UsuariosService } from './usuarios.service';

@Component({
  selector: 'app-novo-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './novo-usuario.component.html',
  styleUrl: './novo-usuario.component.scss'
})
export class NovoUsuarioComponent {
  private readonly usuariosService = inject(UsuariosService);
  private readonly router = inject(Router);

  salvando = signal(false);
  erro = signal('');
  sucesso = signal('');

  form: CriarUsuarioRequest = {
    cpf: '',
    nome: '',
    email: '',
    telefone: '',
    senha: '',
    role: 'MOTORISTA'
  };

  salvar(): void {
    this.erro.set('');
    this.sucesso.set('');

    if (!this.form.cpf || !this.form.nome || !this.form.senha || !this.form.role) {
      this.erro.set('Preencha CPF, nome, senha e perfil.');
      return;
    }

    this.salvando.set(true);

    const request: CriarUsuarioRequest = {
      ...this.form,
      cpf: this.form.cpf.replace(/\D/g, ''),
      telefone: this.form.telefone?.replace(/\D/g, '') ?? ''
    };

    this.usuariosService.criarUsuario(request).subscribe({
      next: () => {
        this.sucesso.set('Usuário criado com sucesso.');
        this.salvando.set(false);

        setTimeout(() => {
          this.router.navigate(['/usuarios']);
        }, 700);
      },
      error: (err) => {
        this.erro.set(err?.error?.message || 'Não foi possível criar o usuário.');
        this.salvando.set(false);
      }
    });
  }

  voltar(): void {
    this.router.navigate(['/usuarios']);
  }
}