export type TipoEntregaAnexo =
  | 'CANHOTO'
  | 'COMPROVANTE_ENTREGA'
  | 'FOTO_MERCADORIA'
  | 'FOTO_AVARIA'
  | 'FOTO_DEVOLUCAO'
  | 'OUTRO';

export interface EntregaAnexo {
  id: string;
  entregaId: string;
  entregaNotaFiscalId: string | null;
  tipo: TipoEntregaAnexo;
  nomeArquivo: string;
  contentType: string;
  tamanhoBytes: number;
  criadoEm: string;
  criadoPor: string;
}