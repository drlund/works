"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
/**
 * MtnAnaliticsTransformer class
 *
 * @class MtnAnaliticsTransformer
 * @constructor
 */

const getCommons = model => {
  return {
    key: model.id_envolvido,
    idEnvolvido: model.id_envolvido,
    parametro: model.parametro,
    descricao: model.descricao,
    item: model.item,
    resultado: model.resultado
  };
};
class MtnAnaliticsTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(model) {
    const transformed = getCommons(model);
    return {
      ...transformed
    };
  }
}

module.exports = MtnAnaliticsTransformer;
