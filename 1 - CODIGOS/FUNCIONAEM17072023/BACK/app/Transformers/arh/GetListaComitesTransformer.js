'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * GetListaComitesTransformer class
 *
 * @class GetListaComitesTransformer
 * @constructor
 */
class GetListaComitesTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform (model) {
    return {
      prefixo: model.PREFIXO,
      codTipoComite: model.COD_ESTRUTURA,
      nomeComite: model.NOME_ESTRUTURA_DECISAO.trim(),
      quorumMinimo: model.QRUM_MINIMO
    }
  }
}

module.exports = GetListaComitesTransformer
