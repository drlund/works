import { EtapaDocumentoSubsidiaria } from '.';
import { validarDadosProcuracaoSubsidiaria } from './validarProcuracaoSubsidiaria';

/** @type {Procuracoes.AllFluxosBaseFluxo<Procuracoes.DocumentoProcuracao>} */
export const ETAPA_PROCURACAO_SUBSIDIARIA = {
  titulo: 'Procuração Pública de Subsidiária',
  nomeCampo: 'dadosProcuracao',
  componente: EtapaDocumentoSubsidiaria,
  validar: validarDadosProcuracaoSubsidiaria,
};
