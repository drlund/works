'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Historico extends Model {

  static get connection() {
    return 'designacao';
  }

  static get table() {
    return 'historicos';
  }

  tipoHistorico () {
    return this.hasOne('App/Models/Mysql/Designacao/TipoHistorico', 'id_historico', 'id')
  }

  documento () {
    return this.hasOne('App/Models/Mysql/Designacao/Documento', 'id_documento', 'id')
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }
}

module.exports = Historico;
