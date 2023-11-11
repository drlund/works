"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const moment = use("moment");
const exception = use("App/Exceptions/Handler");

class ParseRegistroReacao {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle(ctx, next) {
    const { request } = ctx;

    const { dadosReacao, idSolicitacao } = request.allParams();
    const { conteudoReacao, dataReacao, fonteReacao } = dadosReacao;

    if (!conteudoReacao || !dataReacao || !fonteReacao) {
      throw new exception("Dado obrigatório não informado", 400);
    }

    const parsedDataReacao = moment(dadosReacao.dataReacao);

    if (!parsedDataReacao.isValid()) {
      throw new exception("Formato da data inválido", 400);
    }

    ctx.parsedParams = {
      ...dadosReacao,
      idSolicitacao: parseInt(idSolicitacao),
      dataReacao: parsedDataReacao.format('YYYY-MM-DD'),
    };

    // call next to advance the request
    await next();
  }
}

module.exports = ParseRegistroReacao;
