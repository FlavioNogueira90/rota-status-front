import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { finalize } from 'rxjs';
import {
  ManifestoService,
  NovoManifestoRequest,
  NovaEntregaRequest
} from '../../../../core/api/manifesto.service';

@Component({
  selector: 'app-novo-manifesto',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './novo-manifesto.component.html',
  styleUrls: ['./novo-manifesto.component.scss']
})
export class NovoManifestoComponent {
  private service = inject(ManifestoService);
  private router = inject(Router);

  salvando = false;
  erro: string | null = null;
  sucesso: string | null = null;

  form: NovoManifestoRequest = {
    numeroManifesto: 0,
    motoristaId: '',
    veiculoPlaca: '',
    entregas: [
      { numero: 1, clienteNome: '', endereco: '' }
    ]
  };

  adicionarEntrega() {
    const proximoNumero =
      (this.form.entregas?.length ? Math.max(...this.form.entregas.map(e => e.numero)) : 0) + 1;

    this.form.entregas.push({
      numero: proximoNumero,
      clienteNome: '',
      endereco: ''
    });
  }

  removerEntrega(i: number) {
    if (this.form.entregas.length <= 1) return;
    this.form.entregas.splice(i, 1);
  }

  validar(): string | null {
    if (!this.form.numeroManifesto || this.form.numeroManifesto <= 0) return 'Informe um número de manifesto válido.';
    if (!this.form.motoristaId.trim()) return 'Informe o motoristaId.';
    if (!this.form.veiculoPlaca.trim()) return 'Informe a placa do veículo.';
    if (!this.form.entregas?.length) return 'Adicione pelo menos uma entrega.';

    for (const e of this.form.entregas) {
      if (!e.numero || e.numero <= 0) return 'Cada entrega deve ter um número válido.';
      if (!e.clienteNome.trim()) return `Entrega ${e.numero}: informe o cliente.`;
      if (!e.endereco.trim()) return `Entrega ${e.numero}: informe o endereço.`;
    }

    // checar números duplicados
    const nums = this.form.entregas.map(e => e.numero);
    const hasDup = new Set(nums).size !== nums.length;
    if (hasDup) return 'Existe entrega com número duplicado. Ajuste os números.';

    return null;
  }

  salvar() {
    this.erro = null;
    this.sucesso = null;

    const msg = this.validar();
    if (msg) {
      this.erro = msg;
      return;
    }

    this.salvando = true;

    this.service.criarNovoManifesto(this.form)
      .pipe(finalize(() => (this.salvando = false)))
      .subscribe({
        next: (manifestoCriado) => {
          this.sucesso = `Manifesto #${manifestoCriado.numeroManifesto} criado com sucesso!`;
          // vai direto para o monitoramento do manifesto criado
          this.router.navigate(['/manifestos'], {
            queryParams: { numero: manifestoCriado.numeroManifesto }
          });
        },
        error: (err) => {
          this.erro = 'Falha ao criar manifesto. Verifique os dados e tente novamente.';
          console.error(err);
        }
      });
  }

  preencherExemplo() {
    this.form = {
      numeroManifesto: 9100,
      motoristaId: 'MOT-9100',
      veiculoPlaca: 'FAN9100',
      entregas: [
        { numero: 1, clienteNome: 'Cliente A', endereco: 'Rua A, 100 - SP' },
        { numero: 2, clienteNome: 'Cliente B', endereco: 'Rua B, 200 - SP' }
      ]
    };
  }
}
