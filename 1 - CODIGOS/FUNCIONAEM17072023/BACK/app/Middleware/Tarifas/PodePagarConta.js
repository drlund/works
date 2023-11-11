"use strict";

const UsuarioRepository = use(
  "App/Commons/Tarifas/repositories/UsuarioRepository"
);
const { GetPermissaoPgtoConta } = use(
  "App/Commons/Tarifas/useCases/useCasesTarifas"
);
const exception = use("App/Exceptions/Handler");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class PodePagarConta {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, session }, next) {
    
    const dadosUsuario = session.get("currentUserAccount");
    const useCaseGetPermissaoPgtoConta = new GetPermissaoPgtoConta(
      dadosUsuario
    );

    const podePagarConta = await useCaseGetPermissaoPgtoConta.run();
    if (podePagarConta) {
      await next();
      return;
    }

    throw new exception(
      `Usuário não tem permissão para registrar pagamento em conta corrente.`,
      403
    );
    
  }
}

module.exports = PodePagarConta;
