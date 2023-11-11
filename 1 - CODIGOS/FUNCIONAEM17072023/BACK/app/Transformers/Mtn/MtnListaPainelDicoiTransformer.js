"use strict";

const moment = use('App/Commons/MomentZoneBR');
const BumblebeeTransformer = use("Bumblebee/Transformer");

/**
 * MtnTimelineTransformer class
 *
 * @class MtnTimelineTransformer
 * @constructor
 */

const getCommons = model => {
  return {
    key: model.id,
    id: model.id,
    nrMtn: model.nr_mtn,
    prazoDu: model.prazo_du,
    visao: model.desc_visao,
    dataCriacao: moment(model.data_criacao).format('DD/MM/YYYY'),
    evento: model.evento,
    qtdAnalises: model.qtd_analises,
    qtdForaPrazo: model.qtd_fora_prazo,
    bbAtende: model.bbatende,
    medida: model.textomedida
  };
};
class MtnListaPainelDicoiTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform(model) {
    const transformed = getCommons(model);
    return {
      ...transformed,
      envolvido: `${model.matricula} - ${model.nome_funci}`,
      prefixo: `${model.prefixo_ocorrencia} - ${model.nome_prefixo_ocorrencia}`
    };
  }
}

module.exports = MtnListaPainelDicoiTransformer;
