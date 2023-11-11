"use strict";

const hasPermission = use("App/Commons/HasPermission");
const reacoesPrefixosModel = use("App/Models/Mysql/Encantar/ReacoesPrefixos");
const solicitacoesModel = use("App/Models/Mysql/Encantar/Solicitacoes");
/**
 *
 *    Função que verifica se o usuário tem permissão para visualizar os Registros de Reação. O usuário tem acesso
 *    caso tenha o acesso REACOES_CLIENTE, seja solicitante de uma solicitação ou esteja lotado no prefixo fato
 *
 */

const verificarPermissaoRegistroReacao = async (usuarioLogado) => {

  const possuiAcessoGlobal = await hasPermission({
    nomeFerramenta: "Encantar",
    dadosUsuario: usuarioLogado,
    permissoesRequeridas: ["REACOES_CLIENTES"],
    verificarTodas: true,
  });

  const pertencePrefixoFato = await reacoesPrefixosModel
    .query()
    .where("prefixo", usuarioLogado.prefixo)
    .first();

  const isFuncionarioSolicitante = await solicitacoesModel
    .query()
    .where("matriculaSolicitante", usuarioLogado.chave)
    .first();

  return pertencePrefixoFato || possuiAcessoGlobal || isFuncionarioSolicitante
    ? true
    : false;
};

module.exports = verificarPermissaoRegistroReacao;
