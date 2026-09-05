import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { Role } from '../../core/auth/auth.models';

type HeaderMenu = 'cadastros' | 'monitoramento' | 'rota' | 'conta' | null;

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

  me = this.auth.me;

  openMenu: HeaderMenu = null;
  mobileMenuOpen = false;

  role = computed<Role | null>(() => this.me()?.role ?? null);

  roleLabel = computed(() => {
    const r = this.role();

    if (r === 'ADMIN') return 'Administrador';
    if (r === 'OPERADOR') return 'Operador';
    if (r === 'MOTORISTA') return 'Motorista';

    return 'Usuário';
  });

  userInitial = computed(() => {
    const r = this.role();

    if (r === 'ADMIN') return 'A';
    if (r === 'OPERADOR') return 'O';
    if (r === 'MOTORISTA') return 'M';

    return 'U';
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

    if (r === 'ADMIN') return 'Gerencie cadastros e acompanhe a operação.';
    if (r === 'OPERADOR') return 'Acompanhe manifestos e entregas em tempo real.';
    if (r === 'MOTORISTA') return 'Acompanhe seus manifestos e entregas.';

    return '';
  });

  isAdmin = computed(() => this.role() === 'ADMIN');
  isOperador = computed(() => this.role() === 'OPERADOR');
  isMotorista = computed(() => this.role() === 'MOTORISTA');

  toggleMenu(
    menu: Exclude<HeaderMenu, null>,
    event?: Event
  ): void {
    event?.stopPropagation();

    this.openMenu =
      this.openMenu === menu
        ? null
        : menu;
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.openMenu = null;
  }

  closeMenus(): void {
    this.openMenu = null;
    this.mobileMenuOpen = false;
  }

  logout(): void {
    this.closeMenus();
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }
}
