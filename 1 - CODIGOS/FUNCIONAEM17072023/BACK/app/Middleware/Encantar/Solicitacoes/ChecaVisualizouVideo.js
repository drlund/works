"use strict";
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */


/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const videosVisualizadosModel = use(
  "App/Models/Mysql/Encantar/SolicitacoesCapacitacaoVideosVisualizados"
);

//TypeDefs
const typeDefs = require("../../../Types/TypeUsuarioLogado");

/**
 *  Caso o usuário já tenha visualizado o video, já devolve com o ok
 */

class ChecaVisualizouVideo {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request, response, session }, next) {

    const {idVideo} = request.allParams();
    /** @type {typeDefs.UsuarioLogado} */
    const usuarioLogado = session.get("currentUserAccount");

    const visualizado = await videosVisualizadosModel
      .query()
      .where("idVideo", idVideo)
      .where("matricula", usuarioLogado.chave)
      .fetch();

    if (visualizado.toJSON().length > 0 ) {
      response.ok("Usuário já visualizou o vídeo");
      return;
    }

    await next();
  }
}

module.exports = ChecaVisualizouVideo;
