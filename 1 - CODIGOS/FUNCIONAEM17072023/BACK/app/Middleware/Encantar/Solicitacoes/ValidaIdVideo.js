"use strict";
/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const capacitacaoVideosModel = use(
  "App/Models/Mysql/Encantar/SolicitacoesCapacitacaoVideosLista"
);
const exception = use("App/Exceptions/Handler");

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class ValidaIdVideo {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle({ request }, next) {
    const { idVideo } = request.allParams();
    const video = await capacitacaoVideosModel.find(idVideo);

    if (!video) {
      throw new exception("Id do vídeo inválido", 400);
    }
    // call next to advance the request
    await next();
  }
}

module.exports = ValidaIdVideo;
