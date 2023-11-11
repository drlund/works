"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");

/**
 * LockTransformer class
 *
 * @class LockTransformer
 * @constructor
 */
class MtnLockTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(model) {
    return {
      idMtn: model.id_mtn,
      matriculaAnalista: model.matricula_analista,
      nomeAnalista: model.nome_analista,
      renovadoEm: model.renovado_em,
    };
  }
}

module.exports = MtnLockTransformer;
