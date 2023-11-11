const BumblebeeTransformer = use('Bumblebee/Transformer')

class GetOrdemTransformer extends BumblebeeTransformer {
  transform (model) {

    let dadosBasicos = {
      id: model.id,
      numero: model.numero,
      titulo: model.titulo,
      descricao: model.descricao,
      tipoValidade: model.tipo_validade,
      dataValidade: model.data_validade,
      dataLimVigenciaTemp: model.data_limite_vig_temp,
      dataVigRevog: model.data_vig_ou_revog,
      estado: model.id_estado,
      nomeEstado: model.estado.estado,
      confidencial: model.confidencial
    }

    return {
      dadosBasicos,
      instrucoesNorm: model.instrucoesNormativas,
      participantes: model.participantes,
      colaboradores: model.colaboradores,
      autorizacaoConsulta: model.autorizacaoConsulta ? model.autorizacaoConsulta : []
    }
  }
}

module.exports = GetOrdemTransformer