'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * MtnAnexoTransformer class
 *
 * @class MtnAnexoTransformer
 * @constructor
 */
class MtnAnexoTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform (model) {
    
    return {    
      idAnexo: model.id_anexo,  
      nomeArquivo: model.dadosAnexo.nome_original,
      tipo: model.dadosAnexo.tipo,
      incluidoPor: model.dadosAnexo.incluido_por,
      mimeType: model.dadosAnexo.mime_type, 
      extensao: model.dadosAnexo.extensao,     
      criadoEm: model.dadosAnexo.created_at,
      atualizadoEm: model.dadosAnexo.updated_at
    }
  }
}

module.exports = MtnAnexoTransformer
