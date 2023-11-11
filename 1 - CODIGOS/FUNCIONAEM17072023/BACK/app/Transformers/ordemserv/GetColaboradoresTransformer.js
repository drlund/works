'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')
const { getOneDependencia } = use("App/Commons/Arh");

/**
 * GetColaboradoresTransformer class
 *
 * @class GetColaboradoresTransformer
 * @constructor
 */
class GetColaboradoresTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  async transform (model) {
    let transformed = {
      key: model.matricula,
      matricula: model.matricula,
      nome: model.dadosFunci ? model.dadosFunci.nome : "FUNCI NÃO LOCALIZADO NA BASE",
      nomeGuerra: model.dadosFunci && model.dadosFunci.nomeGuerra ? model.dadosFunci.nomeGuerra.NOME_GUERRA_215.trim() : "NÃO LOCALIZADO",
      cargo: model.dadosFunci ? model.dadosFunci.desc_cargo : "NÃO LOCALIZADO",
      img: 'https://humanograma.intranet.bb.com.br/avatar/' + model.matricula
    }

    transformed.prefixo = "0000";
    transformed.nomeDependencia = "NÃO LOCALIZADA";
    
    if (model.dadosFunci) {
      let dependencia = await getOneDependencia(model.dadosFunci.ag_localiz);
      transformed.prefixo = dependencia.prefixo;
      transformed.nomeDependencia = dependencia.nome;
    }
    
    return transformed;
  }
}

module.exports = GetColaboradoresTransformer
