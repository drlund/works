'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const exception = use('App/Exceptions/Handler');
const apiKeysModel = use('App/Models/Mysql/ChavesApi');

/**
 * Middleware que valida se a api-key passada é valida para a ferramenta informada.
 * Exemplo de uso nas rotas:
 * 
 *    Route.get("XPTO", "ControllerXPTO.find").middleware(["isApiKeyValid:Demandas"])
 * 
 * Para usar a rota o utilizador precisa passar o parâmetro apiKey na chamada da requisição.
 */
class IsApiKeyValid {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ request }, next, properties) {
    const nomeFerramenta = properties[0];
    const { apiKey } = request.all();

    if (!apiKey) {
      throw new exception("apiKey não informada!", 400)
    }

    let isValid = await apiKeysModel.query()
      .where('chave', apiKey)
      .where('ferramenta', nomeFerramenta)
      .getCountDistinct('chave');

    if (!isValid) {
      throw new exception("apiKey informada é inválida!", 400)
    }

    // call next to advance the request
    await next()
  }
}

module.exports = IsApiKeyValid
