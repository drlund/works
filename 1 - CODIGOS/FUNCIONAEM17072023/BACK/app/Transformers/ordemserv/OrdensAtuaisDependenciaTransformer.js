const BumblebeeTransformer = use('Bumblebee/Transformer')
 
class OrdensAtuaisDependenciaTransformer extends BumblebeeTransformer {
  transform (model) {
    return {
        id_colaborador: "",
        id_part_expandido: "",
        id_part_edicao: model.id,
        id_ordem: model.id_ordem === null ? "" : model.id_ordem,
        id_estado: model.ordem.estado.id === null ? "" : model.ordem.estado.id,
        data_criacao: model.ordem.data_criacao === null ? "" : model.ordem.data_criacao,
        numero: model.ordem.numero === null ? "" : model.ordem.numero,
        titulo: model.ordem.titulo === null ? "" : model.ordem.titulo,
        estado: model.ordem.estado.estado === null ? "" : model.ordem.estado.estado,
        tipo_validade: model.ordem.tipo_validade === null ? "" : model.ordem.tipo_validade,
        data_validade: model.ordem.data_validade === null ? "" : model.ordem.data_validade,
        participacao: "Dependência",
        data_vig_ou_revog:  model.ordem.data_vig_ou_revog === null ? "" : model.ordem.data_vig_ou_revog,
        assinou: "",
        nao_passivel_assinatura: 0,
        eh_colaborador: false
    }
  }
}

module.exports = OrdensAtuaisDependenciaTransformer