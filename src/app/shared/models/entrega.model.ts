export interface Entrega {
  numero: number;
  clienteNome: string;
  endereco: string;
  status: string;
  iniciadaEm: string | null;
  chegadaEm: string | null;
  concluidaEm: string | null;
  motivoDevolucao: string | null;
}
