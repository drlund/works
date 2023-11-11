"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
/**
 * MtnQuestViewTransformer class
 *
 * @class MtnQuestViewTransformer
 * @constructor
 */

const getCommons = model => {
  return {
    key: model.hash_id,
    pergunta: model.pergunta,
    resposta: model.resposta
  };
};
class MtnQuestViewTransformer extends BumblebeeTransformer {
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

module.exports = MtnQuestViewTransformer;
