import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  private readonly auth = inject(AuthService);

  me = this.auth.me;

  primeiroNome = computed(() => {
    const nome = this.me()?.nome?.trim();

    if (!nome) {
      return 'Usuário';
    }

    return nome.split(' ')[0];
  });

  isAdmin = computed(() => this.me()?.role === 'ADMIN');
  isOperador = computed(() => this.me()?.role === 'OPERADOR');
  isMotorista = computed(() => this.me()?.role === 'MOTORISTA');
}