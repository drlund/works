"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const exception = use("App/Exceptions/Handler");
const isReadOnly = use("App/Commons/Mtn/isReadOnly");

class CheckReadOnly {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, session, response }, next) {
    const dadosUsuario = session.get("currentUserAccount");
    const readOnly = await isReadOnly(dadosUsuario);

    if (readOnly) {
      if (["POST", "PATCH", "DELETE"].includes(request.method())) {
        throw new exception(
          "Usuário não pode executar ações, somente visualizar.",
          403
        );
      }
    }
    // call next to advance the request
    await next();
  }
}

module.exports = CheckReadOnly;
