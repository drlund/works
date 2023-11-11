"use strict";

/** @type {typeof import('../../../Commons/Constants')} */
const { EncantarConsts } = use("Constants");
const exception = use("App/Exceptions/Handler");
const { CAMINHO_MODELS } = EncantarConsts;

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const solicitacoesModel = use(`${CAMINHO_MODELS}/Solicitacoes`);
const hasPermission = use("App/Commons/HasPermission");

const isSolicitacaoFinalizada = (solicitacao) => {
  return solicitacao.status.finaliza === 1;
};

/**
 *
 * *  Verifica se uma determinada solicitação pode ser cancelada. São verificadas as seguintes condições:
 *
 *
 *  1 - O usuário logado deve ter a permissão "ADM_ENCANTAR"
 *  3 - A solicitação não pode estar em uma dos status que denotam finalização da solicitação
 *
 *
 * @param {number}  idSolicitacao
 * @param {UsuarioLogado} usuarioLogado
 *
 */
const podeCancelarSolicitacao = async (idSolicitacao, usuarioLogado) => {
  const solicitacao = await solicitacoesModel.find(idSolicitacao);
  await solicitacao.load("status");
  await solicitacao.load("cancelamento");

  const isAdmEncantar = await hasPermission({
    nomeFerramenta: "Encantar",
    dadosUsuario: usuarioLogado,
    permissoesRequeridas: ["ADM_ENCANTAR"],
    verificarTodas: true,
  });

  const solicitacaoFinalizada = await isSolicitacaoFinalizada(
    solicitacao.toJSON()
  );

  return isAdmEncantar && !solicitacaoFinalizada;
};

module.exports = podeCancelarSolicitacao;
