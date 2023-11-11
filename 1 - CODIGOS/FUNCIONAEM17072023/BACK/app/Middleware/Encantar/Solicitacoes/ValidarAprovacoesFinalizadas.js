"use strict";

const exception = use("App/Exceptions/Handler");
const moment = use("moment");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 *   Middleware que vai validar se filtros para pesquisa de aprovações finalizadas
 */

class validarAprovacoesFinalizadas {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */

  async handle({ request }, next) {
    const { periodo } = request.allParams();

    if (!Array.isArray(periodo)) {
      throw new exception("Período inválido", 400);
    }

    for (const data of periodo) {
      if (!moment(JSON.parse(data)).isValid()) {
        throw new exception("Período inválido", 400);
      }
    }

    // call next to advance the request
    await next();
  }
}

module.exports = validarAprovacoesFinalizadas;
