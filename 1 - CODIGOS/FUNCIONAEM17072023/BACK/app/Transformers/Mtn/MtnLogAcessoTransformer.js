'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer');
const funciModel = use('App/Models/Mysql/Funci');

/**
 * MtnLogAcessoTransformer class
 *
 * @class MtnLogAcessoTransformer
 * @constructor
 */
class MtnLogAcessoTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  async transform (model) {
    
    const dadosFunci = await funciModel.findBy('matricula', model.matricula);    
    return {      
      idResposta: model.id_resposta,
      acessadoEm: model.ts_acesso,
      matricula: model.matricula,
      nome: dadosFunci.nome.trim()
    }
  }
}

module.exports = MtnLogAcessoTransformer
