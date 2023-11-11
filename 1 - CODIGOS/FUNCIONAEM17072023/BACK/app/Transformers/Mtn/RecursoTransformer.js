"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
const MtnAnexoTransformer = use("App/Transformers/Mtn/MtnAnexoTransformer");

const { mtnConsts } = use("Constants");
const { defaultPrefixoAnalise } = mtnConsts;

const getCommons = (model) => {
  const medida = model.medida
    ? {
        id: model.medida.id,
        txtMedida: model.medida.txt_medida,
      }
    : null;

  return {
    key: model.id,
    id: model.id,
    idEnvolvido: model.id_envolvido,
    txtRecurso: model.txt_recurso,
    dataCriacao: model.created_at,
    medida: medida ? medida.txtMedida : null,
    txtParecer: model.txt_parecer,
    respondidoEm: model.respondido_em,
    reveliaEm: model.revelia_em,
    qtdDiasTrabalhados: model.qtd_dias_trabalhados,
    lido: model.lido,
    lidoEm: model.lido_em,
    medida,
  };
};

/**
 * RecursoTransformer class
 *
 * @class RecursoTransformer
 * @constructor
 */
class RecursoTransformer extends BumblebeeTransformer {
  static get defaultInclude() {
    return ["anexos", "anexosParecer"];
  }

  includeAnexos(model) {
    return this.collection(model.anexos, MtnAnexoTransformer);
  }
  includeAnexosParecer(model) {
    return this.collection(model.anexosParecer, MtnAnexoTransformer);
  }

  /**
   * This method is used to transform the data.
   */
  transform(model) {
    return {
      ...getCommons(model),
      matRespAnalise: model.mat_resp_analise,
      nomeRespAnalise: model.nome_resp_analise,
    };
  }

  async transformMeuMtn(model) {
    return {
      ...getCommons(model),
      respAnalise: defaultPrefixoAnalise,
    };
  }
}

module.exports = RecursoTransformer;
