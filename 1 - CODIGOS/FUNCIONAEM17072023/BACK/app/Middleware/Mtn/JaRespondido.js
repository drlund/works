"use strict";

const respostasModel = use("App/Models/Postgres/MtnResposta");
const exception = use("App/Exceptions/Handler");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class JaRespondido {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request }, next) {

    const { idResposta } = request.allParams();
    // call next to advance the request
    let count = await respostasModel
      .query()
      .whereNull("ts_resposta")
      .where("id_resposta", idResposta)
      .getCount();
    
    if (parseInt(count) > 0) {
      throw new exception(`Demanda ainda não foi respondida`, 403);
    }

    // call next to advance the request
    await next();
  }
}

module.exports = JaRespondido;
