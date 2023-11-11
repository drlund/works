/**
 * 
 *   Retona a o fluxo atual com base na sequencia recebida
 * 
 */

const getFluxoAprovacaoAtual = async ({fluxoUtilizado, sequenciaFluxoAtual}) => {

  const fluxoAtual = fluxoUtilizado.find((fluxo) => {
    return fluxo.sequencia === sequenciaFluxoAtual;
  });

  return fluxoAtual;
}

module.exports = getFluxoAprovacaoAtual;