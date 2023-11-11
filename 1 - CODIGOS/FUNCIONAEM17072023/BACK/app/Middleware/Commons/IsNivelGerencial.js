'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const isComissaoNivelGerencial = use("App/Commons/Arh/isComissaoNivelGerencial");

class IsNivelGerencial {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ response, session }, next) {
    try {
      const dadosUsuario = session.get('currentUserAccount');

      const isNivelGerencial = await isComissaoNivelGerencial(
        dadosUsuario.cod_funcao
      );
  
      if (!isNivelGerencial) {
        return response.forbidden("A ação solicitada é permitida apenas para funcionários com função gerencial.");
      }
    } catch (error) {
      return response.badRequest('Erro ao verificar as permissões para a ação solicitada.');
    }

    // call next to advance the request
    await next()
  }
}

module.exports = IsNivelGerencial
