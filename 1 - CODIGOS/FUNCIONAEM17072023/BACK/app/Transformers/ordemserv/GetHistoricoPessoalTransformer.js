'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * GetHistoricoPessoalTransformer class
 *
 * @class GetHistoricoPessoalTransformer
 * @constructor
 */
class GetHistoricoPessoalTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform (model) {
    return {
      id: model.id,
      idOrdem: model.ordem.id,
      dataEvento: model.data_evento,
      numero: model.ordem.numero,
      titulo: model.ordem.titulo,
      tipoParticipacao: model.tipo_participacao,
      descEvento: model.evento.evento
    }
  }
}

module.exports = GetHistoricoPessoalTransformer
