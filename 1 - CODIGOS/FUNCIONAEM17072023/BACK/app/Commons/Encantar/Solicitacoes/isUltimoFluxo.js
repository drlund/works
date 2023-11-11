const { EncantarConsts } = use("Constants");
const { CAMINHO_MODELS } = EncantarConsts;

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const fluxoUtilizadoModel = use(`${CAMINHO_MODELS}/SolicitacoesFluxoUtilizado`);

const isUltimoDoFluxo = async (idSolicitacao, fluxoAtual) => {
  const fluxoUtilizado = await fluxoUtilizadoModel
    .query()
    .where("idSolicitacao", idSolicitacao)
    .orderBy("sequencia", "asc")
    .fetch();
  return (
    fluxoAtual.id ===
    fluxoUtilizado.toJSON()[fluxoUtilizado.toJSON().length - 1].id
  );
};

module.exports = isUltimoDoFluxo;
