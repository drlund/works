"use strict";

const { EncantarConsts } = use("Constants");
const {
  CAMINHO_MODELS,
  CAMINHO_COMMONS,
  STATUS_SOLICITACAO,
  ACOES_HISTORICO_SOLICITACAO,
} = EncantarConsts;

const exception = use("App/Exceptions/Handler");

/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/avancarSolicitacaoNoFluxo')} */
const liberarBrindesReservados = use(
  `${CAMINHO_COMMONS}/Estoque/liberarBrindesReservados`
);

/** @type {typeof import('../../../Commons/Encantar/salvarAnexos')} */
const salvarAnexos = use(`${CAMINHO_COMMONS}/salvarAnexos`);

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const solicitacoesCancelamentosModel = use(
  `${CAMINHO_MODELS}/SolicitacoesCancelamentos`
);
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const fluxoUtilizadoModel = use(`${CAMINHO_MODELS}/SolicitacoesFluxoUtilizado`);

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const solicitacoesModel = use(`${CAMINHO_MODELS}/Solicitacoes`);

const moment = use("moment");
/**
 *
 *  Função que registra uma o cancelamento de um solicitação
 *
 */

const registrarCancelamentoSolicitacao = async ({
  idSolicitacao,
  usuarioLogado,
  justificativa,
  anexos,
  trx,
}) => {
  const solicitacao = await solicitacoesModel.find(idSolicitacao);
  solicitacao.idSolicitacoesStatus = STATUS_SOLICITACAO.CANCELADA;
  const cancelamento = new solicitacoesCancelamentosModel();
  cancelamento.idSolicitacao = idSolicitacao;
  cancelamento.funciMatriculaCancelamento = usuarioLogado.chave;
  cancelamento.funciNomeCancelamento = usuarioLogado.nome_usuario;
  cancelamento.motivoCancelamento = justificativa;
  await cancelamento.save(trx);

  await salvarAnexos(
    cancelamento,
    anexos,
    "CANCELAMENTO",
    usuarioLogado.chave,
    trx,
    "anexos"
  );

  await liberarBrindesReservados(solicitacao.id, usuarioLogado.chave, trx);
  await fluxoUtilizadoModel
    .query()
    .where("idSolicitacao", idSolicitacao)
    .whereNull("finalizadoEm")
    .update({
      finalizadoEm: moment().format("YYYY-MM-DD HH:mm"),
      justificativa: "Finalizado devido ao cancelamento da solicitação",
      tipoFinalizacao: "revelia",
    });
  await solicitacao.save(trx);
};

module.exports = registrarCancelamentoSolicitacao;
