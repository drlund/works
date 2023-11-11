const BumblebeeTransformer = use('Bumblebee/Transformer')
 
class OrdensAtuaisColaboradorTransformer extends BumblebeeTransformer {
  transform (model) {
    let possuiAlteracaoInsNorm = false;

    if (model.ordem.instrucoesNormativas) {
      for (const reg of model.ordem.instrucoesNormativas) {
        if (reg.sofreu_alteracao) {
          possuiAlteracaoInsNorm = true;
          break;
        }
      }
    }

    return {
        id_colaborador: model.id === null ? "" : model.id,
        id_part_expandido: "",
        id_part_edicao: "",
        id_ordem: model.id_ordem === null ? "" : model.id_ordem,
        id_estado: model.ordem.estado.id === null ? "" : model.ordem.estado.id,
        data_criacao: model.ordem.data_criacao === null ? "" : model.ordem.data_criacao,
        numero: model.ordem.numero === null ? "" : model.ordem.numero,
        titulo: model.ordem.titulo === null ? "" : model.ordem.titulo,
        estado: model.ordem.estado.estado === null ? "" : model.ordem.estado.estado,
        tipo_validade: model.ordem.tipo_validade === null ? "" : model.ordem.tipo_validade,
        data_validade: model.ordem.data_validade === null ? "" : model.ordem.data_validade,
        participacao: "Colaborador",
        data_vig_ou_revog:  model.ordem.data_vig_ou_revog === null ? "" : model.ordem.data_vig_ou_revog,
        assinou: "",
        nao_passivel_assinatura: "",
        eh_colaborador: true,
        possuiAlteracaoInsNorm: possuiAlteracaoInsNorm
    }
  }

  transformAutorizacaoConsulta (model) {
    let possuiAlteracaoInsNorm = false;

    if (model.ordem.instrucoesNormativas) {
      for (const reg of model.ordem.instrucoesNormativas) {
        if (reg.sofreu_alteracao) {
          possuiAlteracaoInsNorm = true;
          break;
        }
      }
    }

    return {
        id_colaborador: model.id === null ? "" : model.id,
        id_part_expandido: "",
        id_part_edicao: "",
        id_ordem: model.id_ordem === null ? "" : model.id_ordem,
        id_estado: model.ordem.estado.id === null ? "" : model.ordem.estado.id,
        data_criacao: model.ordem.data_criacao === null ? "" : model.ordem.data_criacao,
        numero: model.ordem.numero === null ? "" : model.ordem.numero,
        titulo: model.ordem.titulo === null ? "" : model.ordem.titulo,
        estado: model.ordem.estado.estado === null ? "" : model.ordem.estado.estado,
        tipo_validade: model.ordem.tipo_validade === null ? "" : model.ordem.tipo_validade,
        data_validade: model.ordem.data_validade === null ? "" : model.ordem.data_validade,
        participacao: "Consulta",
        data_vig_ou_revog:  model.ordem.data_vig_ou_revog === null ? "" : model.ordem.data_vig_ou_revog,
        assinou: "",
        nao_passivel_assinatura: "",
        eh_colaborador: false,
        possuiAlteracaoInsNorm: possuiAlteracaoInsNorm
    }
  }
}

module.exports = OrdensAtuaisColaboradorTransformer