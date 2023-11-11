'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const isDesignado = use('App/Commons/OrdemServ/isDesignado');
const exception = use('App/Exceptions/Handler');

class IsDesignante {
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
    let isParticipante = await isDesignado(id, dadosUsuario.chave);

    if (!isParticipante) {
      throw new exception("A ação solicitada só é permitida para os designados desta ordem!", 400);
    }

    // call next to advance the request
    await next()
  }
}

module.exports = IsDesignante