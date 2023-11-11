"use strict";

const { ChecaPodeConfirmarPgto } = use(
  "App/Commons/Tarifas/useCases/useCasesTarifas"
);

const exception = use("App/Exceptions/Handler");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class PodeConfirmarPgto {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, session }, next) {
    const { idPagamento } = request.allParams();
    /** @type {commonsTypes.UsuarioLogado} */
    const dadosUsuario = session.get("currentUserAccount");

    if (!idPagamento) {
      throw new exception(`Id do pagamento é obrigatório.`, 400);
    }

    const useCasePodeConfirmarPagamento = new ChecaPodeConfirmarPgto(
      idPagamento,
      dadosUsuario
    );

    const podeConfirmar = await useCasePodeConfirmarPagamento.run();
    if (podeConfirmar) {
      await next();
      return;
    }
    throw new exception(
      `Usuário não tem acesso para realizar essa operação.`,
      400
    );
  }
}

module.exports = PodeConfirmarPgto;
