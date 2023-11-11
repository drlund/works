'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const respostasModel = use('App/Models/Postgres/MtnResposta');
const exception = use('App/Exceptions/Handler');

class FunciPodeResponder {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request, session }, next) {

    const dadosUsuario = session.get("currentUserAccount");
    const {idResposta} = request.allParams();
    // call next to advance the request
    let count = await respostasModel
      .query()
      .where("matricula", dadosUsuario.chave)
      .where("id_resposta",idResposta)
      .getCount();

    if(count == 0){
      throw new exception(`Usuário não é público alvo desta demanda`, 403);
    }

    await next()
  }
}

module.exports = FunciPodeResponder
