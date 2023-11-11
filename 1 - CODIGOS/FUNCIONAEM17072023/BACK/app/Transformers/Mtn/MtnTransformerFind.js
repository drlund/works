"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
const { mtnConsts } = use("Constants");
const { mtnStatus } = mtnConsts;
const { A_ANALISAR, EM_ANALISE, FINALIZADO } = mtnStatus;
const LockTransformer = use("App/Transformers/Mtn/MtnLockTransformer");
const transformMedidas = (medidas) => {
  return medidas.map((medida) => {
    return { id: medida.id, txtMedida: medida.txt_medida };
  });
};

const getFechadoSemEnvolvido = (fechadoSemEnvolvido) => {
  const newFechadoSemEnvolvido = { ...fechadoSemEnvolvido };
  if (fechadoSemEnvolvido.anexos) {
    newFechadoSemEnvolvido.anexos = fechadoSemEnvolvido.anexos.map((anexo) => {
      return {
        idAnexo: anexo.id_anexo,
        nomeArquivo: anexo.dadosAnexo.nome_original,
        tipo: anexo.dadosAnexo.tipo,
        incluidoPor: anexo.dadosAnexo.incluido_por,
        mimeType: anexo.dadosAnexo.mime_type,
        extensao: anexo.dadosAnexo.extensao,
        criadoEm: anexo.dadosAnexo.created_at,
        atualizadoEm: anexo.dadosAnexo.updated_at,
      };
    });
  }

  return newFechadoSemEnvolvido;
};

/**
 * MtnFindTransformer class
 *
 * @class MtnFindTransformer
 * @constructor
 */
class MtnFindTransformer extends BumblebeeTransformer {
  static get availableInclude() {
    return ["lock"];
  }

  includeLock(model) {
    return this.item(model.lock, LockTransformer);
  }

  /**
   * This method is used to transform the data.
   */
  transform(model) {
    const newEnvolvidos = model.envolvidos.map((envolvido) => {
      return {
        // key: envolvido.id,
        idEnvolvido: envolvido.id,
        matricula: envolvido.matricula,
        nomeFunci: envolvido.nome_funci,
      };
    });

    const newFechadoSemEnvolvido = model.fechadoSemEnvolvido
      ? getFechadoSemEnvolvido(model.fechadoSemEnvolvido)
      : null;

    let status = "";
    switch (model.status.id) {
      case A_ANALISAR:
        status = "A analisar";
        break;
      case EM_ANALISE:
        status = "Em análise";
        break;
      case FINALIZADO:
        status = "Finalizado";
        break;
      default:
        status = "STATUS INVÁLIDO";
        break;
    }

    return {
      key: model.id,
      id: model.id,
      nrMtn: model.nr_mtn,
      visao: model.visao.desc_visao,
      orientJustVisao: model.visao.orientacao_justificativa,
      status,
      idStatus: model.status.id,
      descOcorrencia: model.desc_ocorrencia,
      readOnly: model.readOnly,
      fechadoSemEnvolvido: newFechadoSemEnvolvido,
      dadosPrefixo: {
        prefixo: model.prefixo_ocorrencia,
        nomePrefixo: model.nome_prefixo_ocorrencia,

        superComercial: {
          prefixo: model.prefixo_super_comercial,
          nome: model.nome_super_comercial,
        },
        superNegocial: {
          prefixo: model.prefixo_super_negocial,
          nome: model.nome_super_negocial,
        },
        unidadeEstrategica: {
          prefixo: model.prefixo_unidade_estrategica,
          nome: model.nome_unidade_estrategica,
        },
      },
      abertoEm: model.created_at,
      qtdEnvolvidos: newEnvolvidos.length,
      envolvidos: newEnvolvidos,
      acao: model.acao,
      medidas: transformMedidas(model.medidas),
    };
  }
}

module.exports = MtnFindTransformer;
