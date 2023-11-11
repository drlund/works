"use strict";

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const exception = use("App/Exceptions/Handler");
const LoggerClass = use(`App/Commons/RouteLogger`);

class RouteLogger {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   * @param {object} properties Nome da ferramenta da qual o Log é referente.
   */

  async handle(ctx, next, properties) {
    //Atenção: não inserir try ...catch nesse middleware. 
    //Como ele sempre é o último na sequência dos middlewares, os erros
    //vindos do controller estava sendo mascarados por o try..catch daqui.
    //Se der erro no logger vai logar o erro direto. Se vir do controller vai
    //logar o erro do controller nos arquivos adonis.json e http_erros.log.
    const ferramenta = properties[0] ? properties[0] : "N/D";
    const logger = new LoggerClass({ ctx, ferramenta });
    await logger.registrarLog();

    await next();
  }
}

module.exports = RouteLogger;
