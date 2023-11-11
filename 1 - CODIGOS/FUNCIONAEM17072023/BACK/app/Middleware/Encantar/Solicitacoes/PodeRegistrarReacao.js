"use strict";

/** @type {typeof import('../../../Commons/Constants')} */
const { EncantarConsts } = use("Constants");
const exception = use("App/Exceptions/Handler");
const { CAMINHO_MODELS, CAMINHO_COMMONS } = EncantarConsts;

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const solicitacoesModel = use(`${CAMINHO_MODELS}/Solicitacoes`);
const hasPermission = use("App/Commons/HasPermission");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class PodeRegistrarReacao {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, session }, next) {

    const { idSolicitacao } = request.allParams();
    const usuarioLogado = session.get("currentUserAccount");
    const possuiAcessoGlobal = await hasPermission({
      nomeFerramenta: "Encantar",
      dadosUsuario: session.get("currentUserAccount"),
      permissoesRequeridas: ["REACOES_CLIENTES"],
      verificarTodas: true,
    });

    const solicitacao = await solicitacoesModel.find(idSolicitacao);

    const isFunciPrefixoFato =
      solicitacao.prefixoFato === usuarioLogado.prefixo;
    const isFunciPrefixoSolicitante =
      solicitacao.prefixoSolicitante === usuarioLogado.prefixo;

    if(!possuiAcessoGlobal && !isFunciPrefixoFato && !isFunciPrefixoSolicitante){
      throw new exception(`Usuário não tem acesso à essa solicitação`, 401);
    }

    // call next to advance the request
    await next();
  }
}

module.exports = PodeRegistrarReacao;
