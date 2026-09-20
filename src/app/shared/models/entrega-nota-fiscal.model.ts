export type StatusNotaFiscal =
  | 'PENDENTE'
  | 'ENTREGUE'
  | 'ENTREGUE_PARCIAL'
  | 'DEVOLVIDA'
  | 'NAO_REALIZADA';

export type MotivoDevolucao =
  | 'RECUSA_CLIENTE'
  | 'FALTA'
  | 'AVARIA'
  | 'DIVERGENCIA'
  | 'PRODUTO_INCORRETO'
  | 'OUTRO';

export type MotivoNaoRealizacao =
  | 'TEMPO_INSUFICIENTE'
  | 'CLIENTE_FECHADO'
  | 'CLIENTE_SEM_SISTEMA'
  | 'CLIENTE_AUSENTE'
  | 'CLIENTE_SEM_ESPACO'
  | 'ENDERECO_NAO_LOCALIZADO'
  | 'VEICULO_COM_PROBLEMA'
  | 'PROBLEMA_NA_CARGA'
  | 'ROTA_INTERROMPIDA'
  | 'OUTRO';

export interface EntregaNotaFiscal {
  /**
   * ID da tentativa logística EntregaNotaFiscal.
   * É este ID que deve ser enviado ao endpoint /resultado.
   */
  id: string;

  /**
   * ID do documento fiscal permanente.
   */
  notaFiscalId: string;

  numero: string;
  serie: string;
  chaveAcesso: string | null;
  tipoDocumento: string;
  status: StatusNotaFiscal;

  motivoDevolucao: MotivoDevolucao | null;
  motivoNaoRealizacao: MotivoNaoRealizacao | null;
  justificativa: string | null;
}