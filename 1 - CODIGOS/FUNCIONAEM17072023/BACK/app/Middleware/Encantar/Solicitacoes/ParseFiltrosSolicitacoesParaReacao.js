"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const moment = use("moment");

class ParseFiltrosSolicitacoesParaReacao {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle(ctx, next) {
    const { request } = ctx;
    const filtros = JSON.parse(request.allParams().filtros);    
    ctx.parsedParams = { ...filtros };

    
    if (filtros.periodoCriacaoSolicitacao) {
      const parsedDatas = [
        moment(filtros.periodoCriacaoSolicitacao[0]),
        moment(filtros.periodoCriacaoSolicitacao[1]),
      ];

      ctx.parsedParams.periodoCriacaoSolicitacao = parsedDatas;
    }

    // call next to advance the request
    await next();
  }
}

module.exports = ParseFiltrosSolicitacoesParaReacao;
