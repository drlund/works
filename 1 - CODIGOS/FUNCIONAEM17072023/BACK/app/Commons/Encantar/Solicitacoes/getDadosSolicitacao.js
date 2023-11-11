//CONSTANTES
const { EncantarConsts } = use("Constants");
const { CAMINHO_MODELS, CAMINHO_COMMONS } = EncantarConsts;

/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/getDadosClientesEncantar')} */
const getDadosClientesEncantar = use(
  `${CAMINHO_COMMONS}/getDadosClientesEncantar`
);
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const solicitacoesModel = use(`${CAMINHO_MODELS}/Solicitacoes`);
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const produtoBBModel = use(`${CAMINHO_MODELS}/ProdutosBB`);
/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/getFluxoAprovacaoAtual')} */
const getFluxoAprovacaoAtual = use(
  `${CAMINHO_COMMONS}/Solicitacoes/getFluxoAprovacaoAtual`
);
/**
 *
 *  Retorna dados da solicitação pelo id da mesma
 *  @param {number} idSolicitacao
 */

const relacionamentos = [
  "redesSociais",
  "status",
  "produtoBB",
  "anexos",
  "reacoes",
  "enderecoCliente",
];

const getDadosSolicitacao = async (idSolicitacao) => {
  const solicitacaoDB = await solicitacoesModel.find(idSolicitacao);
  for (const relacionamento of relacionamentos) {
    await solicitacaoDB.load(relacionamento);
  }

  await solicitacaoDB.load("fluxoUtilizado", (builder) => {
    builder.with("anexos");
  });

  await solicitacaoDB.load("tratamentoDevolucao", (builder) => {
    builder.with("anexos");
  });

  await solicitacaoDB.load("cancelamento", (builder) => {
    builder.with("anexos");
  });

  await solicitacaoDB.load("brindes", (builder) => {
    builder.with("dadosPrefixo");
    builder.with("brinde", (builder) => {
      builder.with("imagens");
    });
  });

  await solicitacaoDB.load("historico", (builder) => {
    builder.with("acao");
  });

  await solicitacaoDB.load("envio", (builder) => {
    builder.with("anexos");
    builder.with("tipoEnvio");
  });

  await solicitacaoDB.load("entregaCliente", (builder) => {
    builder.with("anexos");
  });

  const solicitacao = solicitacaoDB.toJSON();
  const produtoBB = await produtoBBModel.find(solicitacao.idProdutoBB);
  solicitacao.produtoBB = produtoBB.toJSON();

  solicitacao.dadosCliente = await getDadosClientesEncantar(solicitacao);

  solicitacao.fluxoAtual = await getFluxoAprovacaoAtual(solicitacao);

  return solicitacao;
};

module.exports = getDadosSolicitacao;
