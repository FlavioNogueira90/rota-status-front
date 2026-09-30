export type StatusEntrega =
  | 'PENDENTE'
  | 'EM_TRANSITO'
  | 'AGUARDANDO_RECEBIMENTO'
  | 'INTERROMPIDA'
  | 'CONCLUIDO'
  | 'CONCLUIDO_COM_APONTAMENTOS';

export interface Entrega {
  id: string;
  numero: number;
  clienteNome: string;
  endereco: string;
  status: StatusEntrega;
  iniciadaEm: string | null;
  chegadaEm: string | null;
  concluidaEm: string | null;
  justificativaStatus: string | null;
}