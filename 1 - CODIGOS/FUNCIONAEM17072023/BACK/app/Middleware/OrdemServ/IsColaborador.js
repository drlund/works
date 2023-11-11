'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const isColaborador = use('App/Commons/OrdemServ/isColaborador');
const isDesignante = use('App/Commons/OrdemServ/isDesignante');
const exception = use('App/Exceptions/Handler');

class IsColaborador {
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
    let isParticipante = await isColaborador(id, dadosUsuario.chave);

    if (!isParticipante) {
      //verifica se eh designante
      isParticipante = await isDesignante(id, dadosUsuario.chave);

      if (!isParticipante) {
        //se nao for colaborador ou designante nao permite a acao.
        throw new exception("A ação solicitada é permitida apenas para Colaboradores/Designantes!", 400);
      }
    }

    // call next to advance the request
    await next()
  }
}

module.exports = IsColaborador