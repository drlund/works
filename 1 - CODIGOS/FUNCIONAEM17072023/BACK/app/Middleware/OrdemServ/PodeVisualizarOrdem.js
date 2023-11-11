'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const podeVisualizarOrdem = use('App/Commons/OrdemServ/podeVisualizarOrdem');
const exception = use('App/Exceptions/Handler');

class PodeVisualizarOrdem {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, session }, next) {
    const { id } = request.allParams();

    if (!id) {
      throw new exception(`Id da ordem não informado`, 400);  
    }

    let dadosUsuario = session.get('currentUserAccount');
    let userRoles = dadosUsuario.roles ? dadosUsuario.roles : [];
    let podeVisualizar = await podeVisualizarOrdem(id, dadosUsuario.chave, dadosUsuario.prefixo, true, userRoles);

    if (!podeVisualizar.result) {
      throw new exception(podeVisualizar.motivo || "Você não possui permissão para visualizar os dados desta ordem!", 400);
    }

    // call next to advance the request
    await next()
  }
}

module.exports = PodeVisualizarOrdem