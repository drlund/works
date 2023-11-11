'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * FuncionalidadesTransformer class
 *
 * @class FuncionalidadesTransformer
 * @constructor
 */
class FuncionalidadesTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform (funcionalidade) {
    return {
      id: funcionalidade.id,
      idProjeto: funcionalidade.idProjeto,
      idStatus: funcionalidade.idStatus,
      idTipo: funcionalidade.idTipo,
      idProjetoFuncionalidade: funcionalidade.idProjetoFuncionalidade,
      titulo: funcionalidade.titulo,
      tituloCheck: null,
      descricao: funcionalidade.descricao,
      descricaoCheck: null,
      detalhe: funcionalidade.detalhe,
      responsaveis: funcionalidade.responsaveis,
      responsaveisTemp: [],
      isNew: false,
      exibirModal: false,
      checkTipoResponsavel: false,
      selecionadosDrop: [],
    }
  }
}

module.exports = FuncionalidadesTransformer
