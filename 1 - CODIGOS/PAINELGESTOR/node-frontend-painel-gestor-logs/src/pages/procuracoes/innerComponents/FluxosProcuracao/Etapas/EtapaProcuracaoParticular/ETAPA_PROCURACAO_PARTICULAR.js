import { EtapaDocumentoParticular } from '.';
import { validarDadosProcuracaoParticular } from './validarProcuracaoParticular';

/** @type {Procuracoes.AllFluxosBaseFluxo<Procuracoes.DocumentoProcuracao>} */
export const ETAPA_PROCURACAO_PARTICULAR = {
  titulo: 'Procuração Particular',
  nomeCampo: 'dadosProcuracao',
  componente: EtapaDocumentoParticular,
  validar: validarDadosProcuracaoParticular,
};
