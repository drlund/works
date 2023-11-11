"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");

/**
 * Qtdes Painel Dicoi class
 *
 * @class Qtdes Painel Dicoi
 * @constructor
 */

const getCommons = model => {
  return {
    qtdMtn: model.qtd_mtn,
    qtdAnalises: model.qtd_analises,
    qtdForaPrazo: model.qtd_fora_prazo,
    percentualForaPrazo: model.percentualForaPrazo.toFixed(2),
  };
};
class MtnQtdsPainelDicoiTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(model) {
    const transformed = getCommons(model);
    return {
      ...transformed,
    };
  }
}

module.exports = MtnQtdsPainelDicoiTransformer;
