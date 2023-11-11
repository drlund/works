"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
const LockTransformer = use("App/Transformers/Mtn/MtnLockTransformer");

/**
 * MtnPendentesSuperTransformer class
 *
 * @class MtnPendentesSuperTransformer
 * @constructor
 */
class MtnPendentesSuperTransformer extends BumblebeeTransformer {
  static get availableInclude() {
    return ["lock"];
  }

  includeLock(model) {
    return this.item(model.lock, LockTransformer);
  }

  /**
   * This method is used to transform the data.
   */
  async transform(model) {
    const prazo =
      parseInt(model.vwPendentesSuper[0].prazo) > 0
        ? parseInt(model.vwPendentesSuper[0].prazo)
        : 0;
    return {
      id: model.id,
      nrMtn: model.nr_mtn,
      nomeVisao: model.visao ? model.visao.desc_visao : "Não informado",
      qtdEnvolvidos: parseInt(model.__meta__.envolvidos_count),
      criadoEm: model.created_at,
      prazoPendenciaAnalise: prazo,
      ultimaAtualizacao: model.updated_at,
    };
  }
}

module.exports = MtnPendentesSuperTransformer;
