const { EncantarConsts } = use("Constants");
const { CAMINHO_MODELS, STATUS_SOLICITACAO } = EncantarConsts;
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const solicitacoesModel = use(`${CAMINHO_MODELS}/Solicitacoes`);

/**
 *
 *  Pesquisa as solicitações cuja aprovação tenha sido concluída no período recebido
 *
 * @param {Moment[]} periodo Array com duas posições, sendo a primeira a data inicial e a segunda a data final
 * @param {string[]} prefixos Prefixos que participaram do fluxo de aprovação
 *
 * @return {Object[]} Solicitações cuja aprovação tenha sido finalizada no período informado
 *
 */

const getSolicitacoesAprovacaoFinalizada = async (prefixos, periodo) => {
  const solicitacoes = await solicitacoesModel
    .query()
    .whereIn("idSolicitacoesStatus", [
      STATUS_SOLICITACAO.INDEFERIDA,
      STATUS_SOLICITACAO.DEFERIDA,
      STATUS_SOLICITACAO.CANCELADA,
    ])
    .whereHas("fluxoUtilizado", (builder) => {
      builder.whereIn("prefixoAutorizador", prefixos);
    })
    .whereNotNull("finalAprovacaoEm")
    .where(
      "finalAprovacaoEm",
      ">=",
      periodo[0].startOf("day").format("YYYY-MM-DD") + " 00:00:00"
    )
    .where(
      "finalAprovacaoEm",
      "<=",
      periodo[1].startOf("day").format("YYYY-MM-DD") + " 23:59:59"
    )
    .with("status")
    .fetch();

  return solicitacoes;
};

module.exports = getSolicitacoesAprovacaoFinalizada;
