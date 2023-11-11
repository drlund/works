import { EtapaDocumentoPublico } from '.';
import { validarDadosProcuracaoPublica } from './validarProcuracaoPublica';

/** @type {Procuracoes.AllFluxosBaseFluxo<Procuracoes.DocumentoProcuracao>} */
export const ETAPA_PROCURACAO_PUBLICA = {
  titulo: 'Procuração Pública',
  nomeCampo: 'dadosProcuracao',
  componente: EtapaDocumentoPublico,
  validar: validarDadosProcuracaoPublica,
};
