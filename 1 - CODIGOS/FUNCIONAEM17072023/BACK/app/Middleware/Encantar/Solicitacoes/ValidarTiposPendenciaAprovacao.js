"use strict";

const exception = use("App/Exceptions/Handler");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 *   Middleware que vai validar se o tipo de pendência da validação é um dos implementados.
 */

class ValidarTipoPendenciasAprovacao {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */

  async handle({ request }, next) {

    const { tipoPendencia } = request.allParams();
    const tiposAceitos = ["todosDoFluxo", "somentePrefixo"];
    if (!tiposAceitos.includes(tipoPendencia)) {
      throw new exception(`Tipo de pendência de aprovação '${tipoPendencia}' não implementado`, 400);
    }

    // call next to advance the request
    await next();
  }
}

module.exports = ValidarTipoPendenciasAprovacao;
