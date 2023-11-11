//CONSTANTES
const { EncantarConsts } = use("Constants");
const {
  STATUS_SOLICITACAO,
  CAMINHO_COMMONS,
  CAMINHO_MODELS,
  TIPOS_LANCAMENTOS,
} = EncantarConsts;

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const solicitacoesBrindesModel = use(`${CAMINHO_MODELS}/SolicitacoesBrindes`);

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const brindesEstoqueModel = use(`${CAMINHO_MODELS}/BrindesEstoque`);

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const brindesLancamentoModel = use(
  `${CAMINHO_MODELS}/BrindesEstoqueLancamentos`
);

/**
 *
 * Função que libera os brindes que estão reservados para uma solicitação
 *
 *  @param {number} idSolicitacao Id da solcitação cujos brindes serão liberados por
 *  @param {object} trx Transaction dentro da qual as operações de liberar os brindes serão executados
 *
 */

const liberarBrindesReservados = async (idSolicitacao, matricula, trx) => {
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
      .decrement("reserva", brinde.quantidadeSelecionada);

    const lancamentoBrinde = new brindesLancamentoModel();
    lancamentoBrinde.idBrindesEstoque = brinde.estoque.id;
    lancamentoBrinde.idTipoLancamentos = TIPOS_LANCAMENTOS.INDEFERIMENTO;
    lancamentoBrinde.quantidade = brinde.quantidadeSelecionada;
    lancamentoBrinde.matricula = matricula;
    lancamentoBrinde.observacao = "Solicitação indeferida";
    await lancamentoBrinde.save(trx);
  }
};

module.exports = liberarBrindesReservados;
