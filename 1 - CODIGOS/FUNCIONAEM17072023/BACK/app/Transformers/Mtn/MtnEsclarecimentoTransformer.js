"use strict";

const BumblebeeTransformer = use("Bumblebee/Transformer");
const MtnAnexoTransformer = use("App/Transformers/Mtn/MtnAnexoTransformer");
const moment = use("App/Commons/MomentZone");

const getCommons = (model) => {
  let arrayData = model.created_at.substr(0, 10).split("/");
  let dataCriacao = moment(
    `${arrayData[2]}-${arrayData[1]}-${arrayData[0]} 00:00`
  );
  const prazo = dataCriacao.diff(moment(), "days");
  return {
    key: model.id,
    id: model.id,
    prorrogado: model.prorrogado,
    idEnvolvido: model.id_envolvido,
    txtPedido: model.txt_pedido,
    txtResposta: model.txt_resposta,
    respondidoEm: model.respondido_em,
    reveliaEm: model.revelia_em,
    prazo: -1 * prazo,
    diasTrabalhados: model.qtd_dias_trabalhados,
    prorrogado: model.prorrogado,
    lido: model.lido,
    lidoEm: model.lido_em,
    criadoEm: model.created_at,
  };
};

/**
 * MtnEsclarecimentoTransformer class
 *
 * @class MtnEsclarecimentoTransformer
 * @constructor
 */

class MtnEsclarecimentoTransformer extends BumblebeeTransformer {
  static get defaultInclude() {
    return ["anexos"];
  }

  includeAnexos(model) {
    return this.collection(model.anexos, MtnAnexoTransformer);
  }

  /**
   * This method is used to transform the data.
   */
  transform(model) {
    const transformed = getCommons(model);

    return {
      ...transformed,
      matriculaSolicitante: model.matricula_solicitante,
      nomeSolicitante: model.nome_solicitante,
      cdPrefixoSolicitante: model.cd_prefixo_solicitante,
      nomePrefixoSolicitante: model.nome_prefixo_solicitante,
    };
  }

  transformMeuMtn(model) {
    const transformed = getCommons(model);
    return {
      ...transformed,
      solicitante: `${model.cd_prefixo_solicitante} - ${model.nome_prefixo_solicitante}`,
    };
  }
}

module.exports = MtnEsclarecimentoTransformer;
