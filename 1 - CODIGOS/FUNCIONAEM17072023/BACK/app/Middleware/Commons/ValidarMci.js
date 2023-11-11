"use strict";
const exception = use("App/Exceptions/Handler");
/** @type {RegExp} */
const { REGEX_MCI } = use("Regex");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 *   Regra de validação para verificar se o MCI foi informado e é válido.
 *
 */

class ValidarMci {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request }, next) {
      
    const { mci } = request.allParams();

    if (!mci) {
      throw new exception("Informe o MCI do funcionário", 400);
    }

    // if (!REGEX_MCI.test(mci)) {
    //   throw new exception("Formato do MCI inválido", 400);
    // }

    // call next to advance the request
    await next();
  }
}

module.exports = ValidarMci;
