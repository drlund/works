"use strict";

const moment = use("moment");
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class ParseParamsMinhasSolicitacoe {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle(ctx, next) {
    const { request } = ctx;

    const { periodoSolicitacao } = request.allParams();

    if (periodoSolicitacao) {
      ctx.parsedParams = {
        periodoSolicitacao: [
          moment(JSON.parse(periodoSolicitacao[0])),
          moment(JSON.parse(periodoSolicitacao[1])),
        ],
      };
    }

    // call next to advance the request
    await next();
  }
}

module.exports = ParseParamsMinhasSolicitacoe;
