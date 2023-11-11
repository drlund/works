'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class TipoHistorico extends Model {

  static get connection() {
    return 'designacao';
  }

  static get table() {
    return 'tipos_historico';
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }
}

module.exports = TipoHistorico;
