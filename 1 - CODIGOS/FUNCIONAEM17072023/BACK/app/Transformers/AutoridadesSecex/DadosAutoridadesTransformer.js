'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * DadosAutoridadesTransformer class
 *
 * @class DadosAutoridadesTransformer
 * @constructor
 */
class DadosAutoridadesTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform (model) {
    return {
      key: model.id,
      ...model
    }
  }
}

module.exports = DadosAutoridadesTransformer
