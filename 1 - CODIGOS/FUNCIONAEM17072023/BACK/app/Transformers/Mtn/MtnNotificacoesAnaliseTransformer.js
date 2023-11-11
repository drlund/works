"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
/**
 * MtnNotificacoesAnaliseTransformer class
 *
 * @class MtnNotificacoesAnaliseTransformer
 * @constructor
 */

const getCommons = model => {
  return {
    key: model.id,
    nrMtn: model.envolvido.mtn.nr_mtn,
    email: model.email,
    criadoEm: model.created_at,
    tipo: model.tipo,
    sucesso: model.sucesso
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
