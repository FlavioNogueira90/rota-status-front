import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { Role } from '../../core/auth/auth.models';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.scss']
})
export class AppLayoutComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  me = this.auth.me; // signal do AuthService

  role = computed<Role | null>(() => this.me()?.role ?? null);

  sidebarSubtitle = computed(() => {
    const r = this.role();
    if (r === 'ADMIN') return 'Administrador';
    if (r === 'OPERADOR') return 'Operador';
    if (r === 'MOTORISTA') return 'Motorista';
    return 'Usuário';
  });

  topbarTitle = computed(() => {
    const r = this.role();
    if (r === 'ADMIN') return 'Painel do Administrador';
    if (r === 'OPERADOR') return 'Painel do Operador';
    if (r === 'MOTORISTA') return 'Painel do Motorista';
    return 'Rota Status';
  });

  topbarHint = computed(() => {
    const r = this.role();
    if (r === 'ADMIN') return 'Gerencie cadastros e usuários do sistema.';
    if (r === 'OPERADOR') return 'Acompanhe manifestos e entregas em tempo real.';
    if (r === 'MOTORISTA') return 'Acompanhe seus manifestos e entregas.';
    return '';
  });

  isAdmin = computed(() => this.role() === 'ADMIN');
  isOperador = computed(() => this.role() === 'OPERADOR');
  isMotorista = computed(() => this.role() === 'MOTORISTA');

  logout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
