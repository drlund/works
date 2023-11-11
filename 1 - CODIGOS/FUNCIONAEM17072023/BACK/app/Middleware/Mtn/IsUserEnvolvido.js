"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const mtnModel = use("App/Models/Postgres/Mtn");
const exception = use("App/Exceptions/Handler");

class IsUserEnvolvido {
  /**
   *
   *  Responsável por verificar se o usuário é um dos envolvidos na ocorrência MTN.
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, session, response }, next) {
    const { idMtn } = request.allParams();
    const dadosUsuario = session.get("currentUserAccount");

    const mtn = await mtnModel.find(idMtn);

    if (!mtn) {
      throw new exception("Ocorrência MTN não encontrada.", 404);
      return;
    }

    await mtn.load("envolvidos");
    for (let envolvido of mtn.toJSON().envolvidos) {
      if (envolvido.matricula === dadosUsuario.chave) {
        await next();
        return;
      }
    }
    throw new exception("Usuário não está envolvido neste MTN.", 403);
  }
}

module.exports = IsUserEnvolvido;
