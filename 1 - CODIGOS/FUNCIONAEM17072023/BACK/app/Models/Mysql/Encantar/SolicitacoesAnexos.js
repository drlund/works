'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class SolicitacoesAnexos extends Model {
  static get connection() {
    return 'encantar';
  }

  static get table() {
    return 'solicitacoesAnexos';
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }
}

module.exports = SolicitacoesAnexos
