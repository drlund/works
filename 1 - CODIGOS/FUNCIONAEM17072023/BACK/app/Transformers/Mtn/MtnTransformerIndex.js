'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const LockTransformer = use("App/Transformers/Mtn/MtnLockTransformer");
const { mtnConsts } = use("Constants");
const { filters } = mtnConsts;
const {EM_ANDAMENTO, FINALIZADOS} = filters;

/**
 * 
 * MtnTransformer class
 *
 * @class MtnTransformer
 * @constructor
 */
class MtnTransformerIndex extends BumblebeeTransformer {

  static get availableInclude() {
    return [
      "lock",
    ];
  }

  includeLock(model) {
    return this.item(model.lock, LockTransformer);
  }

  /**
   * This method is used to transform the data.
   */
  transform (model, {request}) {

    let {tipo} = request.allParams();
    const arrayInstancias = model.envolvidos.map(envolvido => envolvido.instancia);
    if(tipo === EM_ANDAMENTO){      
      return {
        id: model.id,
        nrMtn: model.nr_mtn,
        nomeVisao: model.visao.desc_visao,
        qtdEnvolvidos: parseInt(model.__meta__.envolvidos_count),
        criadoEm: model.created_at,      
        prazoPendenciaAnalise: model.prazo_pendencia_analise,
        instanciaSuper: arrayInstancias.includes('SUPER'),
        ultimaAtualizacao: model.updated_at               
      }
    }else if( tipo === FINALIZADOS){
      return {
        id: model.id,
        nrMtn: model.nr_mtn,
        nomeVisao: model.visao.desc_visao,     
        ultimoParecer: model.envolvidos.length ? model.envolvidos[0].respondido_em : "", // Pressupõem que a lista de envolvidos está ordenada por data de parecer
        criadoEm: model.created_at,      
      }
    }


  }
}

module.exports = MtnTransformerIndex;
