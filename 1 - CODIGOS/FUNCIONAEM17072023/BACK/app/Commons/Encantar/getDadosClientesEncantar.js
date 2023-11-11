//CONSTANTES
const { EncantarConsts } = use("Constants");
const { CAMINHO_MODELS, CAMINHO_COMMONS, STATUS_SOLICITACAO } = EncantarConsts;
const exception = use("App/Exceptions/Handler");

const getDadosBasicosCliente = use(
  "App/Commons/Clientes/getDadosBasicosCliente"
);
const getClassificacaoCliente = use(
  "App/Commons/Clientes/getClassificacaoCliente"
);
const classificacaoEncantarModel = use(
  `${CAMINHO_MODELS}/ClassificacaoClientes`
);

const getSolicitacoesInformacoesBasicasPorMci = use(
  `${CAMINHO_COMMONS}/Solicitacoes/getSolicitacoesInformacoesBasicasPorMci`
);

/**
 *  Array de status das colicitações interrompidas
 */
const STATUS_SOLICITACOES_INTERROMPIDAS = [
  STATUS_SOLICITACAO.INDEFERIDA,
  STATUS_SOLICITACAO.CANCELADA,
];

const converteClassificacaoEncantar = async (classificacao) => {
  const estrelasEncantar = await classificacaoEncantarModel
    .query()
    .where("idPerfil", classificacao)
    .first();

  return estrelasEncantar.classificacao;
};

/**
 *
 * Retorna os dados de um cliente dentro do contexto da ferramenta encantar.
 *
 */

const getDadosClienteEncantar = async (solicitacao) => {
  const dadosCliente = await getDadosBasicosCliente(solicitacao.mci, true);

  if (dadosCliente === null) {
    throw new exception("Cliente não encontrado", 404);
  }
  const classificacao = await getClassificacaoCliente(solicitacao.mci);

  dadosCliente.classificacao = classificacao
    ? await converteClassificacaoEncantar(classificacao)
    : 0;

  const filtros = {
    desconsiderarStatus: STATUS_SOLICITACOES_INTERROMPIDAS,
  };

  if (solicitacao.id) {
    filtros.desconsiderarIds = [solicitacao.id];
  }

  dadosCliente.solicitacoesAnteriores = await getSolicitacoesInformacoesBasicasPorMci(
    solicitacao.mci,
    filtros
  );

  return dadosCliente;
};

module.exports = getDadosClienteEncantar;
