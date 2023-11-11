/**
 *
 *   Realiza o parse nos campos necessários para parâmetros de avançar no fluxo
 *
 */

const parseParamsAvancarFluxo = (params) => {
  /** @type {encantarTypes.NovaSolicitacao} */
  const { justificativa, tipo, avaliacao, idSolicitacao } = params;

  return {
    idSolicitacao: parseInt(idSolicitacao),
    avaliacao: parseInt(avaliacao),
    justificativa,
    tipo,
  };
};

module.exports = parseParamsAvancarFluxo;
