'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const isEquipeComunicacao = use('App/Commons/Patrocinios/isEquipeComunicacao');

class IsEquipeComunicacao {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ response, session }, next) {
    try {
      const dadosUsuario = session.get('currentUserAccount');

      const isEquipeComunic = await isEquipeComunicacao(dadosUsuario);
  
      if (!isEquipeComunic) {
        return response.forbidden("A ação solicitada é permitida apenas para o Núcleo de Comunicação da Super Adm.");
      }
    } catch (error) {
      return response.badRequest('Erro ao verificar as permissões para a ação solicitada.');
    }

    // call next to advance the request
    await next()
  }
}

module.exports = IsEquipeComunicacao
