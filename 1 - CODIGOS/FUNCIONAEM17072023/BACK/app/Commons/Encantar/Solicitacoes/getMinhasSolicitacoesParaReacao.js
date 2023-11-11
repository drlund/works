"use strict";

const { EncantarConsts } = use("Constants");
const { STATUS_SOLICITACAO, CAMINHO_MODELS } = EncantarConsts;
const exception = use("App/Exceptions/Handler");
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const solicitacoesModel = use(`${CAMINHO_MODELS}/Solicitacoes`);

const getMinhasSolicitacoesParaReacao = async (
  periodoSolicitacao,
  usuarioLogado,
  isAdmin
) => {
  const query = solicitacoesModel.query();
  query
    .select(
      "id",
      "mci",
      "nomeCliente",
      "matriculaSolicitante",
      "nomeSolicitante",
      "createdAt",
      "idSolicitacoesStatus"
    )
    .where("idSolicitacoesStatus", STATUS_SOLICITACAO.ENTREGUE);
  if (!isAdmin) {
    query.where((builder) => {
      builder.where("matriculaSolicitante", usuarioLogado.chave);
      builder.orWhere("prefixoFato", usuarioLogado.prefixo);
    });
  }
  query
    .where("createdAt", ">=", periodoSolicitacao[0].format("YYYY-MM-DD"))
    .where("createdAt", "<=", periodoSolicitacao[1].format("YYYY-MM-DD"))
    .with("status");
  const solicitacoes = await query.fetch();

  return solicitacoes;
};

module.exports = getMinhasSolicitacoesParaReacao;
