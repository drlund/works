'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')


const { mtnConsts } = use("Constants");
const { mtnStatus } = mtnConsts;
const { A_ANALISAR, EM_ANALISE, FINALIZADO } = mtnStatus;

/**
 * MtnHistoricoTransformer class
 *
 * @class MtnHistoricoTransformer
 * @constructor
 */
class MtnHistoricoTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  async transform (historico) {
    let status = "";
    switch (historico.status.id) {
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
        status = "Status inválido";
        break;
    }

    return {
      key: historico.id,
      idMtn: historico.id,
      nrMtn: historico.nr_mtn,
      visao: historico.visao ? historico.visao.desc_visao : 'Não disponível',
      sancao: historico.envolvidos[0].medida
        ? historico.envolvidos[0].medida.txt_medida
        : " - ",
      dataAnalise: historico.envolvidos[0].respondido_em ?historico.envolvidos[0].respondido_em : ' - ' ,
      situacao: status
    };

  }
}

module.exports = MtnHistoricoTransformer
