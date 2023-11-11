'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * PublicoAlvoAutoridadesTransformer class
 *
 * @class PublicoAlvoAutoridadesTransformer
 * @constructor
 */
class PublicoAlvoAutoridadesTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform (model) {
    let { matricula, blacklist } = model;

    if (!model.dadosFunci) {
      //matricula do funci nao encontrada na base (funci aposentado/exonerado)
      return {
        key: model.matricula,
        matricula,
        nome: 'NÃO LOCALIZADO',
        nomeGuerra: 'NÃO LOCALIZADO',
        prefixo: 'NÃO LOCALIZADO',
        dependencia: 'NÃO LOCALIZADA',
        cargo: 'NÃO LOCALIZADO',
        blacklist: blacklist === 1 ? 'Não' : 'Sim'
      }  
    }

    let {nome, cargo, ag_localiz:prefixo } = model.dadosFunci;
    let { NOME_GUERRA_215:nomeGuerra } = model.dadosFunci.nomeGuerra ? model.dadosFunci.nomeGuerra : {NOME_GUERRA_215: 'NÃO LOCALIZADO'};
    let { nome:dependencia } = model.dadosFunci.dependencia;

    return {
      key: model.matricula,
      matricula,
      nome,
      nomeGuerra,
      prefixo,
      dependencia,
      cargo,
      blacklist: blacklist === 1 ? 'Não' : 'Sim'
    }
  }
}

module.exports = PublicoAlvoAutoridadesTransformer
