import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';

@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);

  errorMsg = signal<string | null>(null);
  submitting = signal(false);

  form = this.fb.group({
    cpf: ['', [Validators.required, Validators.minLength(11)]],
    senha: ['', [Validators.required, Validators.minLength(1)]],
  });

  // CPF "limpo" (só números)
  private cpfDigits = computed(() =>
    (this.form.value.cpf ?? '').replace(/\D/g, '')
  );

  onSubmit(): void {
    this.errorMsg.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMsg.set('Preencha CPF e senha corretamente.');
      return;
    }

    const cpf = this.cpfDigits();
    const senha = this.form.value.senha ?? '';

    if (cpf.length !== 11) {
      this.errorMsg.set('CPF inválido. Informe 11 dígitos.');
      return;
    }

    this.submitting.set(true);

    this.auth.login({ cpf, senha }).subscribe({
      next: () => {
        // carrega /auth/me para ter role no app (guards etc.)
        this.auth.loadMe().subscribe({
          next: (me) => {
            if (me.role === 'ADMIN') this.router.navigateByUrl('/cadastros');
            else if (me.role === 'OPERADOR') this.router.navigateByUrl('/manifestos');
            else this.router.navigateByUrl('/manifestos/motorista'); // futuro
          },
          error: () => {
            // se por algum motivo o /me falhar, ainda assim deixa entrar (ou desloga)
            this.router.navigateByUrl('/manifestos');
          },
        });
      },
      error: (err) => {
        // mensagens mais amigáveis
        const status = err?.status;
        if (status === 401 || status === 403) {
          this.errorMsg.set('CPF ou senha inválidos.');
        } else {
          this.errorMsg.set('Falha ao entrar. Verifique sua conexão e tente novamente.');
        }
      },
      complete: () => this.submitting.set(false),
    });
  }
}
