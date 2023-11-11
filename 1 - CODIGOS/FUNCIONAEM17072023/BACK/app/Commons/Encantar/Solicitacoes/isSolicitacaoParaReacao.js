"use strict";

const { EncantarConsts } = use("Constants");
const { CAMINHO_MODELS, STATUS_SOLICITACAO } = EncantarConsts;
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const solicitacoesModel = use(`${CAMINHO_MODELS}/Solicitacoes`);
const exception = use("App/Exceptions/Handler");

/**
 *
 *  Recebe um id e verifica se a solicitação está disponível para
 *  registro da reação do cliente.
 *
 */

const isSolicitacaoParaReacao = async (idSolicitacao) => {
  const solicitacao = await solicitacoesModel.find(idSolicitacao);
  if (!solicitacao) {
    throw new exception("Id da solicitação inválido", 404);
  }

  return solicitacao.idSolicitacoesStatus === STATUS_SOLICITACAO.ENTREGUE
    ? true
    : false;
};

module.exports = isSolicitacaoParaReacao;
