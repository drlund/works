"use strict";

const UsuarioRepository = use(
  "App/Commons/Tarifas/repositories/UsuarioRepository"
);
const { GetPermissaoPgto } = use(
  "App/Commons/Tarifas/useCases/useCasesTarifas"
);
const exception = use("App/Exceptions/Handler");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class PodeVisualizarOcorrencia {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, session }, next) {
    const dadosUsuario = session.get("currentUserAccount");
    const useCaseGetPermissaoPgto = new GetPermissaoPgto(
      dadosUsuario
    );

    const podePagar = await useCaseGetPermissaoPgto.run();
    if (podePagar) {
      await next();
      return;
    }

    throw new exception(
      `Usuário não tem permissão para registrar pagamento em conta corrente.`,
      403
    );

    // call next to advance the request
  }
}

module.exports = PodeVisualizarOcorrencia;
