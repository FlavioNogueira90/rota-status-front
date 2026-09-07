export interface ChecklistPreRotaRequest {
  temperaturaCarga: number | null;
  quilometragem: number | null;
  nivelCombustivel: number | null;

  pneusOk: boolean | null;
  luzesOk: boolean | null;
  documentacaoOk: boolean | null;
  equipamentoRefrigeracaoOk: boolean | null;
  cargaConferida: boolean | null;

  observacao: string | null;
}

export interface ChecklistPreRotaResponse {
  id: string;
  numeroManifesto: number;

  temperaturaCarga: number | null;
  quilometragem: number | null;
  nivelCombustivel: number | null;

  pneusOk: boolean | null;
  luzesOk: boolean | null;
  documentacaoOk: boolean | null;
  equipamentoRefrigeracaoOk: boolean | null;
  cargaConferida: boolean | null;

  observacao: string | null;

  concluido: boolean;
  concluidoEm: string | null;
  concluidoPor: string | null;
  concluidoPorNome: string | null;

  criadoEm: string;
  atualizadoEm: string | null;
  atualizadoPor: string | null;
}