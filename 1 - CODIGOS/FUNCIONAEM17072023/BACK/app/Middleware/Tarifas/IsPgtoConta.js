"use strict";

const UsuarioRepository = use(
  "App/Commons/Tarifas/repositories/UsuarioRepository"
);
const { checaIsPgtoConta } = use("App/Commons/Tarifas/useCases/useCasesTarifas");

const exception = use("App/Exceptions/Handler");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class IsPgtoConta {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, session }, next) {
    const { idOcorrencia } = request.allParams();

    if (!idOcorrencia) {
      throw new exception(`Id da ocorrência é obrigatório.`, 400);
    }

    try {
      const useCaseIsPgtoConta = new checaIsPgtoConta(idOcorrencia);

      const isPgtoConta = await useCaseIsPgtoConta.run();
      if (isPgtoConta) {
        await next();
        return;
      }
      throw new exception(
        `Esta ocorrência não foi reservada para pagamento em conta.`,
        403
      );
    } catch (error) {
      if (error.message && !error.stack) {
        throw new exception(error.message, 400);
      } else {
        throw new exception(error, 500);
      }
    }
  }
}

module.exports = IsPgtoConta;
