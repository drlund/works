const { EncantarConsts } = use("Constants");
const { CAMINHO_MODELS } = EncantarConsts;

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const fluxoUtilizadoModel = use(`${CAMINHO_MODELS}/SolicitacoesFluxoUtilizado`);
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const solicitacoesModel = use(`${CAMINHO_MODELS}/Solicitacoes`);
const exception = use("App/Exceptions/Handler");
/**
 *
 *  Recuperar o fluxo atual de uma determinada solicitação.
 *
 *  @param {number} idSolicitação Id da solicitação que se deseja recuperar o fluxo atual
 */

const getFluxoAtualPorSolicitacao = async (idSolicitacao) => {
  try {
    const solicitacao = await solicitacoesModel.find(idSolicitacao);
    const fluxoAtual = await fluxoUtilizadoModel
      .query()
      .where("sequencia", solicitacao.sequenciaFluxoAtual)
      .where("idSolicitacao", solicitacao.id)
      .orderBy("sequencia", "asc")
      .first();
    return fluxoAtual;
  } catch (error) {
    throw new exception(error, 500);
  }
};

module.exports = getFluxoAtualPorSolicitacao;
