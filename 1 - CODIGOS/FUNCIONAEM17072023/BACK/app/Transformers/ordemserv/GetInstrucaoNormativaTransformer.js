const BumblebeeTransformer = use('Bumblebee/Transformer')
const _ = require('lodash');
 
class GetInstrucaoNormativaTransformer extends BumblebeeTransformer {
  
  async transform (base) {

    let transformed = {
      id: base.id,
      idOrdem: base.id_ordem, 
      key: base.numero + "-" + base.cod_tipo_normativo + "-" + base.item,
      nroINC: base.numero,
      titulo: base.titulo,
      codTipoNormativo: base.cod_tipo_normativo,
      tipoNormativo: base.tipo_normativo,
      versao: base.versao,
      item: base.item,
      textoItem: base.texto_item,
      sofreuAlteracao: base.sofreu_alteracao,
      textoItemAlterado: base.texto_item_alterado,
      novaVersao: base.nova_versao
    }

    return transformed;
  }
}

module.exports = GetInstrucaoNormativaTransformer