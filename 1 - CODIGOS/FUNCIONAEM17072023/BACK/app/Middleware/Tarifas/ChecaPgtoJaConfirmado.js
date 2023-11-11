"use strict";

const { isPgtoConfirmado } = use(
  "App/Commons/Tarifas/useCases/useCasesTarifas"
);

const exception = use("App/Exceptions/Handler");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class ChecaPgtoJaConfirmado {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, session }, next) {
    const { idPagamento } = request.allParams();

    if (!idPagamento) {
      throw new exception(`Id do pagamento é obrigatório.`, 400);
    }

    const useCaseIsPgtoConfirmado = new isPgtoConfirmado(idPagamento);

    const jaConfirmado = await useCaseIsPgtoConfirmado.run();
    if (!jaConfirmado) {
      await next();
      return;
    }
    throw new exception(`Este pagamento já foi confirmado.`, 400);
  }
}

module.exports = ChecaPgtoJaConfirmado;
