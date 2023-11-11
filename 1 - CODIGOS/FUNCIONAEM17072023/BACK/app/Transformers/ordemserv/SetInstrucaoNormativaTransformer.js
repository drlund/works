const BumblebeeTransformer = use('Bumblebee/Transformer')
const baseIncUtils = use('App/Commons/BaseIncUtils')
const _ = require('lodash');
 
class SetInstrucaoNormativaTransformer extends BumblebeeTransformer {
  
  async transform (base) {

    try {
      let registroINC = await baseIncUtils.findINCText({
        nroINC: base.nroINC, 
        codTipoNormativo: base.codTipoNormativo, 
        baseItem: base.item,
        versao: base.versao
      });
      
      if (!registroINC) {
        return {
          error: true,
          message: `IN [${base.nroINC}] - item: ${base.item} - Vrs: ${base.versao}`
        }
      }

      let transformed = {
        numero: registroINC.CD_ASNT,
        titulo: registroINC.TX_TIT_ASNT,
        cod_tipo_normativo: registroINC.CD_TIP_CTU_ASNT,
        tipo_normativo: registroINC.TX_TIP_CTU_ASNT,        
        versao: registroINC.NR_VRS_CTU_ASNT,
        item: registroINC.CD_NVL_PRGF_CTU,
        texto_item: String(registroINC.TX_PRGF_CTU).trim()
      }
  
      if (_.isNumber(base.id)) {
        transformed.id = base.id;
      }
  
      return transformed;

    } catch (err) {
      return {
        error: true,
        message: `IN [${base.nroINC}] - item: ${base.item} - Vrs: ${base.versao}`
      };
    }
  }
}

module.exports = SetInstrucaoNormativaTransformer