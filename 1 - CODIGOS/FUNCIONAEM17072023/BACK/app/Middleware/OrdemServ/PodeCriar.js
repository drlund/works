'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const exception = use('App/Exceptions/Handler');

class PodeCriar {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request }, next) {
    let {dadosOrdem} = request.allParams();
    let { dadosBasicos } = dadosOrdem;

    if (dadosBasicos.id) {
      throw new exception("Erro ao criar a ordem! Dados informados não são de uma ordem rascunho!", 400);
    }

    // call next to advance the request
    await next()
  }
}

module.exports = PodeCriar
