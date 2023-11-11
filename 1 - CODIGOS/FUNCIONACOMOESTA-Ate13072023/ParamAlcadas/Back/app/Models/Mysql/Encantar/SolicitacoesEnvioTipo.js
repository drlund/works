'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class SolicitacoesEnvioTipo extends Model {
  static get connection() {
    return 'encantar';
  }

  static get table() {
    return 'solicitacoesEnvioTipo';
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }
}

module.exports = SolicitacoesEnvioTipo
