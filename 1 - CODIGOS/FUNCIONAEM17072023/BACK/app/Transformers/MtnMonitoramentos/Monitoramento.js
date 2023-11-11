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

class Monitoramento extends BumblebeeTransformer {
  static get defaultInclude() {
    return ["versaoAtual", "versoes", "linhaTempo"];
  }

  includeVersaoAtual(model) {
    return this.item(model.versaoAtual, "MtnMonitoramentos/VersaoTransformer");
  }

  includeLinhaTempo(model) {
    return this.collection(
      model.linhaTempo,
      "MtnMonitoramentos/LinhaTempoTransformer"
    );
  }

  includeVersoes(model) {
    const versoes = this.collection(
      model.versoes,
      "MtnMonitoramentos/VersaoTransformer"
    );

    return versoes.data.filter((versao) => {
      return versao.id !== model.versao_atual_id;
    });
  }

  /**
   * This method is used to transform the data.
   */
  transform(model) {
    return {
      id: model.id,
      ativa: model.ativa,
      tipoVersao: model.tipoVersao,
      nomeReduzido: model.nome_reduzido ? model.nome_reduzido : "Não informado",
      nome: model.origem_visao,
      descricao: model.desc_visao,
      status: { id: model.status.id, display: model.status.display },
      createdAt: model.created_at,
    };
  }
}

module.exports = Monitoramento;
