'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Documento extends Model {

  static get connection() {
    return 'designacao';
  }

  static get table() {
    return 'documentos';
  }

  negativa () {
    return this.hasOne('App/Models/Mysql/Designacao/Negativa', 'id_negativa', 'id')
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }
}

module.exports = Documento;
