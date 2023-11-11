"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
const moment = require("moment");
/**
 * MtnTimelineTransformer class
 *
 * @class MtnTimelineTransformer
 * @constructor
 */

const getCommons = (model) => {
  return {
    key: model.id,
    id: model.id,
    acaoDisplay: model.acao.display_text,
    acao: model.acao.tipo,
    data: model.created_at,
  };
};
class MtnTimelineTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(model) {
    const transformed = getCommons(model);
    return {
      ...transformed,
      key: model.id_envolvido,
      responsavel: `${model.mat_resp_acao} - ${model.nome_resp_acao}`,
    };
  }

  transformMeuMtn(model) {
    const transformed = getCommons(model);
    return {
      ...transformed,
      data: model.created_at.substring(0, model.created_at.length - 5),
      responsavel: `${model.prefixo_resp_acao} - ${model.nome_prefixo_resp_acao}`,
    };
  }

  transformFiltrados(model) {
    return {
      nrMtn: model.envolvido.mtn.nr_mtn,
      envolvido: `${model.envolvido.matricula} - ${model.envolvido.nome_funci}`,
      acao: model.acao.display_text,
      visao: model.envolvido.mtn.visao.desc_visao,
      analista: `${model.mat_resp_acao} - ${model.nome_resp_acao}`,
      dataAcao: model.created_at,
    };
  }
}

module.exports = MtnTimelineTransformer;
