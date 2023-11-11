"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
const Env = use("Env");

const BACKEND_URL = Env.get("BACKEND_URL", "http://localhost:3333");
const VIDEO_URL = `${BACKEND_URL}/videos/encantei/`;
/**
 * VideoTransformer class
 *
 * @class VideoTransformer
 * @constructor
 */

class VideoTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(model) {
    return {
      id: model.id,
      titulo: model.titulo,
      url: `${VIDEO_URL}${model.nomeVideo}`,
      finalizado: model.visualizacoes.length > 0,
    };
  }
}

module.exports = VideoTransformer;
