const BumblebeeTransformer = use('Bumblebee/Transformer')
const colaboradorModel = use('App/Models/Mysql/OrdemServ/Colaborador');

class OrdensAtuaisParticipanteTransformer extends BumblebeeTransformer {
  async transform (model) {
    //verifica se o participante tambem eh colaborador
    let dadosColaborador = await colaboradorModel.query()
      .where('matricula', model.matricula)
      .where('id_ordem', model.participanteEdicao.id_ordem)
      .first();

    let isColaborador = dadosColaborador ? true : false;

    let possuiAlteracaoInsNorm = false;

    if (model.participanteEdicao.ordem.instrucoesNormativas) {
      for (const reg of model.participanteEdicao.ordem.instrucoesNormativas) {
        if (reg.sofreu_alteracao) {
          possuiAlteracaoInsNorm = true;
          break;
        }
      }
    }

    return {
        id_colaborador: "",
        id_part_expandido: model.id=== null ? "" : model.id,
        id_part_edicao: model.id_part_edicao === null ? "" : model.id_part_edicao,
        id_ordem: model.participanteEdicao.id_ordem === null ? "" : model.participanteEdicao.id_ordem,
        id_estado: model.participanteEdicao.ordem.estado.id === null ? "" : model.participanteEdicao.ordem.estado.id,
        data_criacao: model.participanteEdicao.ordem.data_criacao === null ? "" : model.participanteEdicao.ordem.data_criacao,
        numero: model.participanteEdicao.ordem.numero === null ? "" : model.participanteEdicao.ordem.numero,
        titulo: model.participanteEdicao.ordem.titulo === null ? "" : model.participanteEdicao.ordem.titulo,
        estado: model.participanteEdicao.ordem.estado.estado === null ? "" : model.participanteEdicao.ordem.estado.estado,
        tipo_validade: model.participanteEdicao.ordem.tipo_validade === null ? "" : model.participanteEdicao.ordem.tipo_validade,
        data_validade: model.participanteEdicao.ordem.data_validade === null ? "" : model.participanteEdicao.ordem.data_validade,
        participacao: model.participanteEdicao.tipo_participacao === null ? "" : model.participanteEdicao.tipo_participacao,
        data_vig_ou_revog:  model.participanteEdicao.ordem.data_vig_ou_revog === null ? "" : model.participanteEdicao.ordem.data_vig_ou_revog,
        assinou: model.assinou,
        nao_passivel_assinatura: model.nao_passivel_assinatura,
        eh_colaborador: isColaborador,
        possuiAlteracaoInsNorm: possuiAlteracaoInsNorm
    }
  }
}

module.exports = OrdensAtuaisParticipanteTransformer