"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const exception = use("App/Exceptions/Handler");
const {evalType} = use("App/Commons/StringUtils");
/**
 *    Método que permite a injeção de parâmetros no objeto Context http, na propriedade ctx.injectedParams.
 *    Deve receber um número par de parâmetros, sendo convertido em um JSON, em duplas <chave> : <valor>
 * 
 * 
 *    O método identifica os seguintes métodos para seus tipos correspondentes:
 * 
 *     - Numérico (inteiro, float, positivos e negativos)
 *     - Booleano (true ou false)
 *
 *    Ex.: Route.get('<rota>', '<Controller>.<metodo>').middleware(['injectParams:chave1,valor1,chave2,valor2,...']);
 *
 *    <Controller>.<metodo>({request,response,...,injectedParams}){
 *
 *        let chave1 = injectedParams.chave1;
 *        let chave2 = injectedParams.chave2;
 *    }
 *
 */

class InjectParams {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle(ctx, next, properties) {

    if (properties.length % 2 !== 0) {
      throw new exception(
        `Middleware injectParams deve receber um número par de parâmetros.`,
        500,
        "BAD_CALL"
      );
    }

    properties = properties.map((propriety) => propriety.trim());

    let injectedParams = {};
    for (let i = 0; i < properties.length; i += 2) {

      //TODO: Implementar tipo Objeto JSON
      let param = properties[i + 1];
      // Caso o valor da seja "true", "false" ou um valor numérico, será convertido para o valor correspondente
      injectedParams[properties[i]] = evalType(param);

    }

    ctx.injectedParams = injectedParams;
    await next();
  }
}

module.exports = InjectParams;
