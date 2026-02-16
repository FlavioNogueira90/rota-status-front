export interface Manifesto {
  numeroManifesto: number;
  status: string;
  motoristaId: string;
  veiculoPlaca: string;
  totalEntregas: number;
  entregasConcluidas: number;
  percentualConcluido: number;
  inicioEm: string | null;
  fimEm: string | null;
}
