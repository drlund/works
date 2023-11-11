"use strict";

const exception = use("App/Exceptions/Handler");
const salvarUploadProcuracao = require('./salvarUploadProcuracao');

class ParseCadastrarProcuracao {
  async handle(ctx, next) {
    try {
      const {
        tipoFluxo,
        idCartorio,
        dadosProcuracao,
        matriculaOutorgado,
        idSubsidiaria,
        urlDocumento,
        poderes,
        idMinutaCadastrada,
      } = ctx.request.allParams();

      const arquivoProcuracao = salvarUploadProcuracao(ctx);

      ctx.parsedParams = {
        tipoFluxo: JSON.parse(tipoFluxo),
        idCartorio: toNumberOrNull(idCartorio),
        dadosProcuracao: JSON.parse(dadosProcuracao),
        poderes: JSON.parse(poderes ?? null),
        matriculaOutorgado,
        idSubsidiaria: toNumberOrNull(idSubsidiaria),
        urlDocumento: urlDocumento !== "null" ? urlDocumento : null,
        arquivoProcuracao: arquivoProcuracao || null,
        idMinutaCadastrada: idMinutaCadastrada || null,
      };
    } catch (error) {
      throw new exception(error, 500);
    }
    await next();
  }
}

function toNumberOrNull(possibleNumber) {
  return isNaN(Number(possibleNumber)) ? null : Number(possibleNumber);
}

module.exports = ParseCadastrarProcuracao;

/**
 * @typedef {{
 *  tipoFluxo: Procuracoes.TipoFluxo,
 *  idCartorio: number,
 *  dadosProcuracao: Procuracoes.DadosProcuracao,
 *  poderes: Procuracoes.Poderes['outorganteSelecionado'],
 *  matriculaOutorgado: string,
 *  idSubsidiaria: number,
 *  urlDocumento: string,
 *  arquivoProcuracao: Promise<string>,
 *  idMinutaCadastrada: string,
 * }} ReturnParseCadastrarProcuracao
 */
