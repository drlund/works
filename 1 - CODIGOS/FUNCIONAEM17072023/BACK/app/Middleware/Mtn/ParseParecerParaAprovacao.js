"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const moment = use("moment");
const exception = use("App/Exceptions/Handler");

const ValidateJsonString = require("../../Commons/ValidateJsonString");

class ParseParecerParaAprovacao {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle(ctx, next) {
    const { request } = ctx;

    let {
      idEnvolvido,
      txtParecer,
      idMedida,
      finalizar,
      finalizarSemConsultarDedip,
      nrGedip,
    } = request.allParams();

    if (
      !ValidateJsonString(idEnvolvido) ||
      !ValidateJsonString(idMedida) ||
      !ValidateJsonString(finalizar)
    ) {
      throw new exception("Parâmetros inválidos", 400);
    }

    ctx.parsedParams = {
      idEnvolvido: JSON.parse(idEnvolvido),
      idMedida: JSON.parse(idMedida),
      finalizar: JSON.parse(finalizar),
      finalizarSemConsultarDedip: JSON.parse(finalizarSemConsultarDedip),
      nrGedip: nrGedip ? nrGedip : null,
      txtParecer: txtParecer,
    };

    // call next to advance the request
    await next();
  }
}

module.exports = ParseParecerParaAprovacao;
