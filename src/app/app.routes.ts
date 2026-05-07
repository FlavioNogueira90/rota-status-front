import { Routes } from '@angular/router';

import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { ManifestoComponent } from './features/manifestos/pages/manifesto/manifesto.component';
import { NovoManifestoComponent } from './features/manifestos/pages/novo-manifesto/novo-manifesto.component';

import { authGuard } from './core/auth/auth.guard';

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
        path: 'manifestos/:numeroManifesto/entregas/:numeroEntrega',
        loadComponent: () =>
          import('./features/entregas/pages/entrega-detalhe/entrega-detalhe.component')
            .then(m => m.EntregaDetalheComponent)
      },
      { path: '**', redirectTo: 'manifestos' }
    ]
  }
];
