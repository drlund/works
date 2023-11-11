//CONSTANTES
const { EncantarConsts } = use("Constants");
const { CAMINHO_MODELS } = EncantarConsts;
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const solicitacoesBrindesModel = use(`${CAMINHO_MODELS}/SolicitacoesBrindes`);

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const brindesEstoqueModel = use(`${CAMINHO_MODELS}/BrindesEstoque`);

/**
 *
 *   Remove do estoque os brindes selecionados para uma solicitação
 *
 */

const removerBrindesSelecionadosDoEstoque = async (idSolicitacao, trx) => {
  const solicitacoesBrindes = await solicitacoesBrindesModel
    .query()
    .where("idSolicitacao", idSolicitacao)
    .with("estoque")
    .fetch();

  for (const brinde of solicitacoesBrindes.toJSON()) {
    await brindesEstoqueModel
      .query()
      .transacting(trx)
      .where("id", brinde.estoque.id)
      .decrement("estoque", brinde.quantidadeSelecionada);
  }
};

module.exports = removerBrindesSelecionadosDoEstoque;
