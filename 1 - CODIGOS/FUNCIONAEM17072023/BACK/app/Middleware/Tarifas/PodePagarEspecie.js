"use strict";

const UsuarioRepository = use(
  "App/Commons/Tarifas/repositories/UsuarioRepository"
);
const GetPermPagarEspecie = use(
  "App/Commons/Tarifas/useCases/PodePagarEspecie"
);
const exception = use("App/Exceptions/Handler");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class PodePagarEspecie {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, session }, next) {
    const { idOcorrencia } = request.allParams();
    /** @type {commonsTypes.UsuarioLogado} */
    const dadosUsuario = session.get("currentUserAccount");

    try {
      const useCasePodePagarEspecie = new GetPermPagarEspecie(
        idOcorrencia,
        dadosUsuario
      );
      const podePagarEspecie = await useCasePodePagarEspecie.run();
      if (podePagarEspecie) {
        await next();
        return;
      }
    } catch (error) {
      if (error.message && !error.stack) {
        throw new exception(error.message, 400);
      } else {
        throw new exception(error, 500);
      }
    }

    throw new exception(
      `Você não pode realizar o pagamento para essa ocorrência.`,
      403
    );
  }
}

module.exports = PodePagarEspecie;
