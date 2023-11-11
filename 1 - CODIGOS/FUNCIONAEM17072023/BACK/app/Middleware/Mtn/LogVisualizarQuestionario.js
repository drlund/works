"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const perguntasModel = use("App/Models/Postgres/MtnLogAcesso");

/** @type {typeof import('moment/moment')} */
const moment = use('App/Commons/MomentZone');

/**
 *
 *   Registra que um funcionário visualizou questionário que ele deveria responder
 *
 *moment
 */
class LogVisualizarQuestionario {
  
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, session }, next) {
    // call next to advance the request
    const { idResposta } = request.allParams();
    let dadosUsuario = session.get("currentUserAccount");
    let teste = await perguntasModel.create({
      id_resposta: idResposta,
      ts_acesso: moment().toDate(),
      matricula: dadosUsuario.chave
    });

    let count = await perguntasModel
      .query()
      .where("matricula", dadosUsuario.chave)
      .where("id_resposta", idResposta)
      .getCount();

    await next();
  }
}

module.exports = LogVisualizarQuestionario;
