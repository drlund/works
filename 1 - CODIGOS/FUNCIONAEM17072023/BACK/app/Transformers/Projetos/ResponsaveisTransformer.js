'use strict'

const BumblebeeTransformer = use('Bumblebee/Transformer')

/**
 * ResponsaveisTransformer class
 *
 * @class ResponsaveisTransformer
 * @constructor
 */
class ResponsaveisTransformer extends BumblebeeTransformer {
  /**
   * This method is used to transform the data.
   */
  transform (responsavel) {

    return {
      id: responsavel.id,
      funcionalidades: responsavel.funcionalidades,
      matricula: responsavel.matricula,
      matriculaCheck: null,
      nome: responsavel.nome,
      funciAtual: {},
      nomeFuncao: responsavel.nomeFuncao,
      nomeEquipe: responsavel.nomeEquipe,
      principal: responsavel.principal,
      principalNestasFuncionalidades: responsavel.principalNestasFuncionalidades,
      administrador: responsavel.administrador,
      dev: responsavel.dev,
      dba: responsavel.dba,
      loading: false,
    };
  }
}

module.exports = ResponsaveisTransformer
