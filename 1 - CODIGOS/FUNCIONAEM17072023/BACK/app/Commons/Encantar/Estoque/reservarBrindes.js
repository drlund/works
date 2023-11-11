const { EncantarConsts } = use("Constants");
const { CAMINHO_MODELS } = EncantarConsts;

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const brindesEstoqueModel = use(`${CAMINHO_MODELS}/BrindesEstoque`);
const brindesEstoqueLancamentos = use(
  `${CAMINHO_MODELS}/BrindesEstoqueLancamentos`
);

/**
 *
 *   Função que para efetuar a reserva dos brindes e registra o lançamento na brindesEstoqueLançamentos
 *
 */

const reservarBrindes = async (brindes, matricula, trx) => {
  for (const brinde of brindes) {
    const estoque = await brindesEstoqueModel.find(brinde.dadosEstoque.id);
    estoque.reserva = estoque.reserva + brinde.quantidadeSelecionada;
    await estoque.save(trx);

    const brindesLancamento = new brindesEstoqueLancamentos();
    brindesLancamento.idBrindesEstoque = brinde.dadosEstoque.id;
    brindesLancamento.idTipoLancamentos = 3; // reserva
    brindesLancamento.quantidade = brinde.quantidadeSelecionada;
    brindesLancamento.observacao = "Reserva de brinde no estoque";
    brindesLancamento.matricula = matricula;
    await brindesLancamento.save(trx);
  }
};
module.exports = reservarBrindes;
