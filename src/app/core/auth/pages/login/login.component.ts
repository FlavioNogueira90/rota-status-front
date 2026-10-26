import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/auth/auth.service';
import { catchError, finalize, switchMap, throwError } from 'rxjs';

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
    if (this.submitting()) return;

    this.errorMsg.set(null);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.errorMsg.set('Preencha CPF e senha corretamente.');
      return;
    }

    const cpf = (this.form.value.cpf ?? '').replace(/\D/g, '');
    const senha = this.form.value.senha ?? '';

    if (cpf.length !== 11) {
      this.errorMsg.set('CPF inválido. Informe 11 dígitos.');
      return;
    }

    this.submitting.set(true);

    this.auth.login({ cpf, senha }).pipe(
      switchMap(() => this.auth.loadMe()),

      catchError(err => {
        // Se o login funcionou, mas /auth/me falhou,
        // removemos o token para evitar uma sessão incompleta.
        this.auth.logout();
        return throwError(() => err);
      }),

      finalize(() => this.submitting.set(false))
    ).subscribe({
      next: (me) => {
        if (me.role === 'ADMIN' || me.role === 'OPERADOR') {
          this.router.navigateByUrl('/home');
        } else {
          this.router.navigateByUrl('/home');
        }
      },

      error: (err) => {
        const status = err?.status;

        if (status === 401 || status === 403) {
          this.errorMsg.set('CPF ou senha inválidos.');
        } else {
          this.errorMsg.set(
            'Falha ao entrar. Verifique sua conexão e tente novamente.'
          );
        }
      }
    });
  }
}
