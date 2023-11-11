"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");

/**
 * CursoTransformer class
 *
 * @class CursoTransformer
 * @constructor
 */
class CursoTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(model) {
    return {
      titulo: model.titulo,
      url: model.url,
      finalizado: model.funcisTreinados.length > 0,
    };
  }
}

module.exports = CursoTransformer;
