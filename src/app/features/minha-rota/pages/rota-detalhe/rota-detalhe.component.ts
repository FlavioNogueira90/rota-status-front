import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { EntregasService } from '../../../../core/api/entregas.service';
import { Entrega } from '../../../../shared/models/entrega.model';

@Component({
    selector: 'app-rota-detalhe',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './rota-detalhe.component.html',
    styleUrl: './rota-detalhe.component.scss'
})
export class RotaDetalheComponent {

    private readonly route = inject(ActivatedRoute);
    private readonly router = inject(Router);
    private readonly entregasService = inject(EntregasService);

    numeroManifesto =
        Number(this.route.snapshot.paramMap.get('numeroManifesto'));

    entregas: Entrega[] = [];

    carregando = true;
    erro = '';
    iniciandoEntrega: number | null = null;
    registrandoChegada: number | null = null;
    concluindoEntrega: number | null = null;
    rotaConcluida = false;

    constructor() {
        this.carregarEntregas();
    }

    carregarEntregas(): void {
        this.carregando = true;
        this.erro = '';

        this.entregasService
            .listarEntregas(this.numeroManifesto)
            .subscribe({
                next: (entregas) => {
                    this.entregas = entregas;
                    this.carregando = false;
                },

                error: (erro) => {
                    console.error(
                        'Erro ao carregar entregas da rota:',
                        erro
                    );

                    this.erro =
                        'Não foi possível carregar as entregas desta rota.';

                    this.carregando = false;
                }
            });
    }

    voltar(): void {
        this.router.navigate(['/minha-rota']);
    }

    statusLabel(status: string): string {
        switch (status) {
            case 'PENDENTE':
                return 'Pendente';

            case 'EM_TRANSITO':
                return 'A caminho';

            case 'AGUARDANDO_RECEBIMENTO':
                return 'No destino';

            case 'ENTREGUE':
                return 'Entregue';

            case 'INTERROMPIDA':
                return 'Interrompida';

            case 'DEVOLUCAO':
                return 'Devolução';

            case 'RECUSADO':
                return 'Recusado';

            default:
                return status;
        }
    }

    statusClass(status: string): string {
        switch (status) {
            case 'PENDENTE':
                return 'status--pendente';

            case 'EM_TRANSITO':
                return 'status--caminho';

            case 'AGUARDANDO_RECEBIMENTO':
                return 'status--destino';

            case 'ENTREGUE':
                return 'status--entregue';

            case 'INTERROMPIDA':
                return 'status--interrompida';

            case 'DEVOLUCAO':
            case 'RECUSADO':
                return 'status--problema';

            default:
                return '';
        }
    }

    iniciarEntrega(entrega: Entrega): void {

        if (this.iniciandoEntrega !== null) {
            return;
        }

        this.iniciandoEntrega = entrega.numero;

        this.entregasService
            .iniciarEntrega(
                this.numeroManifesto,
                entrega.numero
            )
            .subscribe({
                next: (response) => {

                    console.log(
                        'Entrega iniciada:',
                        response
                    );

                    this.iniciandoEntrega = null;
                    this.carregarEntregas();
                },

                error: (erro: HttpErrorResponse) => {

                    console.error(
                        'Erro ao iniciar entrega:',
                        erro
                    );

                    this.iniciandoEntrega = null;

                    /*
                     * Conflito de entrega ativa.
                     */
                    if (
                        erro.status === 409 &&
                        erro.error?.entregaAtivaNumero
                    ) {

                        const entregaAtivaNumero =
                            erro.error.entregaAtivaNumero;

                        const statusEntregaAtiva =
                            erro.error.statusEntregaAtiva;

                        /*
                         * Se a entrega ativa já está no cliente,
                         * ela precisa ser resolvida antes.
                         */
                        if (
                            statusEntregaAtiva ===
                            'AGUARDANDO_RECEBIMENTO'
                        ) {

                            alert(
                                `A entrega #${entregaAtivaNumero} já está no destino.\n\n` +
                                `Finalize a situação desta entrega antes de iniciar a entrega #${entrega.numero}.`
                            );

                            return;
                        }

                        /*
                         * Entrega ativa em trânsito:
                         * permite mudança de prioridade.
                         */
                        if (statusEntregaAtiva === 'EM_TRANSITO') {

                            const entregaAtiva =
                                this.entregas.find(
                                    item =>
                                        item.numero === entregaAtivaNumero
                                );

                            const clienteAtivo =
                                entregaAtiva?.clienteNome
                                    ? ` - ${entregaAtiva.clienteNome}`
                                    : '';

                            const confirmar = confirm(
                                `A entrega #${entregaAtivaNumero}${clienteAtivo} está em andamento.\n\n` +
                                `Deseja interrompê-la para iniciar a entrega #${entrega.numero} - ${entrega.clienteNome}?`
                            );

                            if (confirmar) {
                                this.iniciarComInterrupcao(entrega);
                            }

                            return;
                        }
                    }

                    alert(
                        'Não foi possível iniciar esta entrega.'
                    );
                }
            });
    }

    iniciarComInterrupcao(
        entrega: Entrega
    ): void {

        if (this.iniciandoEntrega !== null) {
            return;
        }

        this.iniciandoEntrega = entrega.numero;

        this.entregasService
            .iniciarEntregaComInterrupcao(
                this.numeroManifesto,
                entrega.numero
            )
            .subscribe({
                next: (response) => {

                    console.log(
                        'Entrega iniciada com interrupção:',
                        response
                    );

                    this.iniciandoEntrega = null;

                    this.carregarEntregas();
                },

                error: (erro) => {

                    console.error(
                        'Erro ao interromper entrega e iniciar nova:',
                        erro
                    );

                    this.iniciandoEntrega = null;

                    alert(
                        'Não foi possível alterar a prioridade das entregas.'
                    );
                }
            });
    }

    registrarChegada(entrega: Entrega): void {

        if (this.registrandoChegada !== null) {
            return;
        }

        this.registrandoChegada = entrega.numero;

        this.entregasService
            .registrarChegada(
                this.numeroManifesto,
                entrega.numero
            )
            .subscribe({
                next: () => {
                    console.log(
                        'Chegada registrada para entrega:',
                        entrega.numero
                    );

                    this.registrandoChegada = null;

                    // Recarrega para refletir AGUARDANDO_RECEBIMENTO
                    this.carregarEntregas();
                },

                error: (erro) => {
                    console.error(
                        'Erro ao registrar chegada:',
                        erro
                    );

                    this.registrandoChegada = null;
                }
            });
    }

    concluirEntrega(entrega: Entrega): void {

        if (this.concluindoEntrega !== null) {
            return;
        }

        this.concluindoEntrega = entrega.numero;

        this.entregasService
            .concluirEntrega(
                this.numeroManifesto,
                entrega.numero
            )
            .subscribe({
                next: () => {
                    console.log(
                        'Entrega concluída:',
                        entrega.numero
                    );

                    this.concluindoEntrega = null;

                    this.carregarEntregas();
                },

                error: (erro) => {
                    console.error(
                        'Erro ao concluir entrega:',
                        erro
                    );

                    this.concluindoEntrega = null;
                }
            });
    }

    get rotaFinalizada(): boolean {
        if (this.entregas.length === 0) {
            return false;
        }

        return this.entregas.every(entrega =>
            entrega.status === 'ENTREGUE' ||
            entrega.status === 'DEVOLUCAO' ||
            entrega.status === 'RECUSADO'
        );
    }
}