'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * GetHistoricoOrdemTransformer class
 *
 * @class GetHistoricoOrdemTransformer
 * @constructor
 */
class GetHistoricoOrdemTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform (model) {
    return {
      id: model.id,
      idOrdem: model.ordem.id,
      dataEvento: model.data_evento,
      numero: model.ordem.numero,
      idEstado: model.ordem.estado.id,
      estado: model.ordem.estado.estado,
      tipoValidade: model.ordem.tipo_validade,
      dataValidade: model.ordem.data_validade,
      titulo: model.ordem.titulo,
      tipoParticipacao: model.tipo_participacao,
      descEvento: model.evento.evento,
      matricula: model.matricula_participante,
      nomeParticipante: model.dadosParticipante ? model.dadosParticipante.nome : model.nome_participante,
      funcaoParticipante: model.funcao_participante,
      prefixo: model.prefixo_participante,
      responsavelAlteracao: model.resp_alteracao
    }
  }
}

module.exports = GetHistoricoOrdemTransformer
