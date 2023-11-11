'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer');
const { mtnConsts } = use("Constants");
const { mtnStatus } = mtnConsts;
const { A_ANALISAR, EM_ANALISE, FINALIZADO } = mtnStatus;
/**
 * MtnHistoricoMtnTransformer class
 *
 * @class MtnHistoricoMtnTransformer
 * @constructor
 */
class HistoricoMtnTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform (model) {

    let status = "";
    switch (model.status) {
      case A_ANALISAR:
        status = "A analisar";
        break;
      case EM_ANALISE:
        status = "Em análise";
        break;
      case FINALIZADO:
        status = "Finalizado"
        break;    
      default:
        status = "STATUS INVÁLIDO"
        break;
    }
    return {
      idMtn: model.id,
      nrMtn: model.nr_mtn,
      visao: model.visao.desc_visao,
      sancao: model.envolvidos[0].medida ? model.envolvidos[0].medida : "Não Aplicada",
      situacao: status     
    }


  }
}

module.exports = HistoricoMtnTransformer
