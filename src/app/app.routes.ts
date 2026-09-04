import { Routes } from '@angular/router';

import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { ManifestoComponent } from './features/manifestos/pages/manifesto/manifesto.component';
import { NovoManifestoComponent } from './features/manifestos/pages/novo-manifesto/novo-manifesto.component';

import { authGuard } from './core/auth/auth.guard';
import { roleGuard } from './core/auth/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./core/auth/pages/login/login.component')
        .then(m => m.LoginComponent)
  },
  {
    path: 'forbidden',
    loadComponent: () =>
      import('./core/auth/pages/forbidden/forbidden.component')
        .then(m => m.ForbiddenComponent)
  },
  {
    path: '',
    component: AppLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'manifestos', pathMatch: 'full' },

      { path: 'manifestos', component: ManifestoComponent },
      { path: 'manifestos/novo', component: NovoManifestoComponent },

      {
        path: 'usuarios',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
          import('./features/usuarios/usuarios.component')
            .then(m => m.UsuariosComponent)
      },
      {
        path: 'usuarios/novo',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
          import('./features/usuarios/novo-usuario.component')
            .then(m => m.NovoUsuarioComponent)
      },
      {
        path: 'usuarios/:id/editar',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN'] },
        loadComponent: () =>
          import('./features/usuarios/editar-usuario.component')
            .then(m => m.EditarUsuarioComponent)
      },
      {
        path: 'manifestos/:numeroManifesto/entregas/:numeroEntrega',
        loadComponent: () =>
          import('./features/entregas/pages/entrega-detalhe/entrega-detalhe.component')
            .then(m => m.EntregaDetalheComponent)
      },
      {
        path: 'veiculos',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'OPERADOR'] },
        loadComponent: () =>
          import('./features/veiculos/veiculos.component')
            .then(m => m.VeiculosComponent)
      },
      {
        path: 'veiculos/novo',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'OPERADOR'] },
        loadComponent: () =>
          import('./features/veiculos/novo-veiculo.component')
            .then(m => m.NovoVeiculoComponent)
      },
      {
        path: 'veiculos/:id/editar',
        canActivate: [roleGuard],
        data: { roles: ['ADMIN', 'OPERADOR'] },
        loadComponent: () =>
          import('./features/veiculos/editar-veiculo.component')
            .then(m => m.EditarVeiculoComponent)
      },
      { path: '**', redirectTo: 'manifestos' }
    ]
  }
];