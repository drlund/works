"use strict";

const fluxoModel = use("App/Models/Mysql/Encantar/Fluxo");

/**
 *
 *    Função que verifica se o usuário tem permissão para incluir uma solicitação. Para tanto
 *    é necessário que exista um fluxo definido para o prefixo dele.
 *
 */

const verificarPermissaoIncluirSolicitacao = async (usuarioLogado) => {
  const fluxoPrefixo = await fluxoModel
    .query()
    .where("prefixo", usuarioLogado.prefixo)
    .first();

  return fluxoPrefixo ? true : false;
};

module.exports = verificarPermissaoIncluirSolicitacao;
