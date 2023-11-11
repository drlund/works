"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('../../../Commons/Constants')} */
const { EncantarConsts } = use("Constants");
const exception = use("App/Exceptions/Handler");
const { CAMINHO_COMMONS } = EncantarConsts;

/** @type {typeof import('../../../Commons/Encantar/Solicitacoes/getSolicitacoesParaRecebimento')} */
const podeCancelarSolicitacao = use(
  `${CAMINHO_COMMONS}/Solicitacoes/podeCancelarSolicitacao`
);

class PodeCancelarSolicitacao {
  /**
   * Só avança deixa avançar caso seja permitido cancelar a solicitação
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, session }, next) {
    const { idSolicitacao } = request.allParams();
    /** @type {typeDefs.UsuarioLogado} */
    const usuarioLogado = session.get("currentUserAccount");

    const permissaoCancelarSolicitacao = await podeCancelarSolicitacao(
      idSolicitacao,
      usuarioLogado
    );
    if (!permissaoCancelarSolicitacao) {
      throw new exception("Usuário não pode registrar o cancelamento.", 400);
    }
    
    // call next to advance the request
    await next();
  }
}

module.exports = PodeCancelarSolicitacao;
