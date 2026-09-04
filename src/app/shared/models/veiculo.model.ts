export type TipoVeiculo =
  | 'UTILITARIO'
  | 'FURGAO'
  | 'VUC'
  | 'CAMINHAO'
  | 'CARRETA'
  | 'OUTRO';

export interface Veiculo {
  id: number;
  placa: string;
  marca: string;
  modelo: string;
  ano: number | null;
  tipoVeiculo: TipoVeiculo;
  capacidadeKg: number | null;
  refrigerado: boolean;
  ativo: boolean;
  criadoEm: string;
  atualizadoEm: string;
}

export interface CriarVeiculoRequest {
  placa: string;
  marca: string;
  modelo: string;
  ano: number | null;
  tipoVeiculo: TipoVeiculo;
  capacidadeKg: number | null;
  refrigerado: boolean;
}

export interface AtualizarVeiculoRequest {
  placa: string;
  marca: string;
  modelo: string;
  ano: number | null;
  tipoVeiculo: TipoVeiculo;
  capacidadeKg: number | null;
  refrigerado: boolean;
}