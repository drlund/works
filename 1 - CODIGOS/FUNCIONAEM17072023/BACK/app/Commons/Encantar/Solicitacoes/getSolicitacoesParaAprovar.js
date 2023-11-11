const { EncantarConsts } = use("Constants");
const { CAMINHO_MODELS, STATUS_SOLICITACAO, CAMINHO_COMMONS } = EncantarConsts;
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const solicitacoesModel = use(`${CAMINHO_MODELS}/Solicitacoes`);
const isAdmEncantar = use(`${CAMINHO_COMMONS}/isAdmEncantar`);



const strategy = {
  todosDoFluxo: (query, prefixosConsiderados) => {
    query.whereHas("fluxoUtilizado", (builder) => {
      builder.whereIn("prefixoAutorizador", prefixosConsiderados);
    });
    return query.clone();
  },

  somentePrefixo: (query, prefixosConsiderados) => {
    query.whereHas("fluxoUtilizado", (builder) => {
      builder.whereRaw(
        "`solicitacoes`.`sequenciaFluxoAtual` = `solicitacoesFluxoUtilizado`.`sequencia`"
      );
      builder.whereIn("prefixoAutorizador", prefixosConsiderados);
    });
    return query.clone();
  },
};

/**
 *  Função que retorna as solicitações que estão disponíveis para uma determinada lista de prefixos.
 *
 *
 *  @param {string[]} prefixosConsiderados Prefixos nos quais as solicitações podem estar pendentes de aprovação ou fazendo parte a cadeia de aprovação
 *  @param {string} tipo Pode ter o valor de "todosDoFluxo" ou "somentePrefixo"
 *
 *  @return {Object[]} Array de solicitações que estão pendentes nos prefixos informados ou estão na cadeia de aprovação dos mesmos.
 *
 *
 *
 */

const getSolicitacoesParaAprovar = async (prefixosConsiderado, tipo) => {
  const query = solicitacoesModel
    .query()
    .where("idSolicitacoesStatus", STATUS_SOLICITACAO.PENDENTE_APROVACAO);

  const solicitacoesPendentes = await strategy[tipo](
    query.clone(),
    prefixosConsiderado
  )
    .with("status")
    .with("fluxoUtilizado", (builder) => {
      builder.orderBy("sequencia", "asc");
    })
    .fetch();    
  return solicitacoesPendentes;
};

module.exports = getSolicitacoesParaAprovar;
