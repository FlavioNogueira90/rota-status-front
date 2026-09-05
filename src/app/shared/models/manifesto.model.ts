export interface Manifesto {
  numeroManifesto: number;
  status: string;

  motoristaId: number;
  motoristaNome: string;
  motoristaCpf: string;

  veiculoId: number;
  veiculoPlaca: string;
  veiculoModelo: string;

  totalEntregas: number;
  entregasConcluidas: number;
  percentualConcluido: number;
  inicioEm: string | null;
  fimEm: string | null;
}
