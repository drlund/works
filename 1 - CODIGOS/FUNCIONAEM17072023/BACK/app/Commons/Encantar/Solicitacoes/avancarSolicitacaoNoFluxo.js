//CONSTANTES
const { EncantarConsts } = use("Constants");
const { STATUS_SOLICITACAO, CAMINHO_MODELS, CAMINHO_COMMONS } = EncantarConsts;

/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/avancarSolicitacaoNoFluxo')} */
const liberarBrindesReservados = use(
  `${CAMINHO_COMMONS}/Estoque/liberarBrindesReservados`
);
/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/isUltimoFluxo')} */
const isUltimoDoFluxo = use(`${CAMINHO_COMMONS}/Solicitacoes/isUltimoFluxo`);

const moment = use("moment");

const registrarAprovacao = {
  deferir: async (solicitacao, fluxoAtual, matricula, trx) => {
    const ultimo = await isUltimoDoFluxo(solicitacao.id, fluxoAtual);
    if (ultimo) {
      solicitacao.idSolicitacoesStatus = STATUS_SOLICITACAO.DEFERIDA;
      solicitacao.finalAprovacaoEm = moment().format("YYYY-MM-DD HH:mm");
    } else {
      solicitacao.sequenciaFluxoAtual = solicitacao.sequenciaFluxoAtual + 1;
    }
    await solicitacao.save(trx);
  },
  indeferir: async (solicitacao, fluxoAtual, matricula, trx) => {
    solicitacao.idSolicitacoesStatus = STATUS_SOLICITACAO.INDEFERIDA;
    solicitacao.finalAprovacaoEm = moment().format("YYYY-MM-DD HH:mm");
    await solicitacao.save(trx);
    await liberarBrindesReservados(solicitacao.id, matricula, trx);
  },
};

/**
 *
 *  Executa ações necessárias quando a solicitação avança no fluxo de aprovacao
 *
 *  @param {string} tipo Tipo de parecer dado pelo fluxo atual. Pode ser 'deferir' ou 'indeferir'
 *  @param {Object} solicitacao Instância do model de solicitação
 *
 *  @param {Object} trx Transaction do contexto onde a ação está sendo executada
 */

const avancarSolicitacaoNoFluxo = async (
  tipo,
  solicitacao,
  fluxoAtual,
  matricula,
  trx
) => {
  await registrarAprovacao[tipo](solicitacao, fluxoAtual, matricula, trx);
};

module.exports = avancarSolicitacaoNoFluxo;
