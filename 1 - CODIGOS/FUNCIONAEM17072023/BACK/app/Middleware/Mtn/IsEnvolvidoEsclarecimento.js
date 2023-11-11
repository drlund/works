"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const esclarecimentoModel = use("App/Models/Postgres/MtnEsclarecimento");
const exception = use("App/Exceptions/Handler");
class IsEnvolvidoEsclarecimento {
  /**
   *
   *  Middleware que verificar se o funcinário logado é o envovolvido ao qual um esclarecimento está vinculado
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, session, reson }, next) {
    const { idEsclarecimento } = request.allParams();
    const esclarecimento = await esclarecimentoModel.find(idEsclarecimento);
    const { chave } = session.get("currentUserAccount");
    await esclarecimento.load("envolvido");
    
    if (esclarecimento.toJSON().envolvido.matricula !== chave) {
      throw new exception(
        `Funcionário ${chave} não é envolvido no MTN ao qual o esclarecimento de id ${idEsclarecimento} está vinculado.`,
        400,
        "USUARIO_NAO_ENVOLVIDO"
      );
    }

    // call next to advance the request
    await next();
  }
}

module.exports = IsEnvolvidoEsclarecimento;
