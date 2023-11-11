'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * GestoresProdutoTransformer class
 *
 * @class GestoresProdutoTransformer
 * @constructor
 */
class GestoresProdutoTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform (model) {
    return {
      prefixo: model.prefixo,
      
    }
  }
}

module.exports = GestoresProdutoTransformer
