const BumblebeeTransformer = use('Bumblebee/Transformer')
 
class OrdensAtuaisAdmTransformer extends BumblebeeTransformer {
  transform (model) {
    return {
        id_ordem: model.id,
        id_estado: model.estado.id,
        data_criacao: model.data_criacao,
        numero: model.numero,
        titulo: model.titulo,
        estado: model.estado.estado,
        tipo_validade: model.tipo_validade === null ? "" : model.tipo_validade,
        data_validade: model.data_validade === null ? "" : model.data_validade,
        data_vig_ou_revog:  model.data_vig_ou_revog === null ? "" : model.data_vig_ou_revog,
        matricula_autor: model.matricula_autor,
        nome_autor: model.dadosAutor.nome,
        prefixo: model.prefixo_autor,
        dependencia: model.dadosAutor.dependencia.nome,
        funcao: model.dadosAutor.desc_cargo
    }
  }
}

module.exports = OrdensAtuaisAdmTransformer