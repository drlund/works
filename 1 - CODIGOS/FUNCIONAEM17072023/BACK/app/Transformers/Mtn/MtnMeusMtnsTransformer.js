'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * MtnMeusMtnsTransformer class
 *
 * @class MtnMeusMtnsTransformer
 * @constructor
 */
class MtnMeusMtnsTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform (model) {
    return{
      idMtn: model.mtn.id,
      nrMtn: model.mtn.nr_mtn,
      status: model.mtn.status.descricao,
      prefixoEpoca: `${model.cd_prefixo_epoca} - ${model.nome_prefixo_epoca}`,
      cargoEpoca: `${model.cd_cargo_epoca} - ${model.nome_cargo_epoca}`      
    };
  }
}

module.exports = MtnMeusMtnsTransformer
