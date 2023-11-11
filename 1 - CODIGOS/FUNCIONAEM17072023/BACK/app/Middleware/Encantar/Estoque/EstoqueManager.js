'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const BrindesEstoquePermissao = use('App/Models/Mysql/Encantar/BrindesEstoquePermissao');
const BrindesResponsavelEntrega = use('App/Models/Mysql/Encantar/BrindesResponsavelEntrega');
// const exception = use("App/Exceptions/Handler");

class EstoqueManager {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ session }, next) {
    // call next to advance the request
    const dadosUsuario = session.get("currentUserAccount");

    if (!dadosUsuario) {
      throw new exception("Dados do usuário não fornecido. Faça login novamente.", 400);
    }

    let hasPrefixoDetentor = await BrindesEstoquePermissao.query()
      .where('prefixo', dadosUsuario.prefixo)
      .first();

    if (!hasPrefixoDetentor) {
      //o parametro only verifica apenas as permissoes.
      throw new exception("Sua dependência não possui permissão para gerenciar um estoque de brindes!", 400);
    }

    let hasMatricula = await BrindesResponsavelEntrega.query()
      .where('matricula', dadosUsuario.chave)
      .first();

    if (!hasMatricula) {
      throw new exception("Você não possui permissão para consultar/alterar o estoque de brindes!", 400);
    }
    
    await next()
  }
}

module.exports = EstoqueManager
