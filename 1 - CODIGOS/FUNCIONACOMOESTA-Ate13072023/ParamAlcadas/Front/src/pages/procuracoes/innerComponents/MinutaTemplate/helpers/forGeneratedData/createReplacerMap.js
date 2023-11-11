import { baseMapProcuracao } from './baseMapProcuracao';

/**
 * @param {Partial<Procuracoes.DadosProcuracao>} dadosProcuracao
 */
export function createReplacerMap(dadosProcuracao) {
  const {
    dadosMinuta: {
      customData: {
        ...restCustom
      } = {}
    }
  } = dadosProcuracao;

  const {
    idMinuta,
    idTemplate,
    tipoFluxo,
    outorgado,
    outorgante,
    blocoSubsidiarias,
    cartorio,
  } = baseMapProcuracao(dadosProcuracao);

  return {
    idMinuta,
    idTemplate,
    tipoFluxo,
    outorgado,
    outorgante,
    blocoSubsidiarias,
    cartorio,
    custom: {
      ...restCustom
    }
  };
}
