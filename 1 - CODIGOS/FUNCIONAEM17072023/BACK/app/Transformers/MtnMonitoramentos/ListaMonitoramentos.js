"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
const { mtnConsts } = use("Constants");
const { mtnStatus } = mtnConsts;
const { A_ANALISAR, EM_ANALISE, FINALIZADO } = mtnStatus;
const { mode } = require("crypto-js");
const moment = require("moment");
/**
 * MtnMonitoramentos class
 *
 * @class MtnMonitoramentos
 * @constructor
 */

const transformCommon = (model) => {
  return;
};

class ListaMonitoramentos extends BumblebeeTransformer {
  transformPendentesVotacao(model) {
    return this.transform(model);
  }

  transformEmVotacao(model) {
    return this.transform(model);
  }

  transformFinalizados(model) {
    return this.transform(model);
  }

  transformParaVotacao(model) {
    const commons = this.transform(model);
    return {
      ...commons,
      versaoAtual: {
        incluidoPor: `${model.incluido_por} - ${model.incluido_por_nome}`,
        motivacao: model.versaoAtual.motivacao,
        statusId: model.status.id,
        status: model.status.display,
      },
    };
  }

  /**
   * This method is used to transform the data.
   */
  transform(model) {
    return {
      id: model.id,
      nomeReduzido: model.nome_reduzido ? model.nome_reduzido : "Não informado",
      nome: model.origem_visao,
      descricao: model.desc_visao,
      status: model.status.display,
      createdAt: model.created_at,
    };
  }
}

module.exports = ListaMonitoramentos;
