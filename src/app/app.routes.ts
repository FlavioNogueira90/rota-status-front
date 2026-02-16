import { Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app-layout/app-layout.component';
import { ManifestoComponent } from './features/manifestos/pages/manifesto/manifesto.component';
import { NovoManifestoComponent } from './features/manifestos/pages/novo-manifesto/novo-manifesto.component';


export const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      { path: '', redirectTo: 'manifestos', pathMatch: 'full' },
      { path: 'manifestos', component: ManifestoComponent },
      { path: 'manifestos/novo', component: NovoManifestoComponent },

      // se ainda não criou detalhe, pode comentar essa rota por enquanto
      {
        path: 'manifestos/:numeroManifesto/entregas/:numeroEntrega',
        loadComponent: () =>
          import('./features/entregas/pages/entrega-detalhe/entrega-detalhe.component')
            .then(m => m.EntregaDetalheComponent)
      },
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
