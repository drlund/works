'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model');

class Tipo extends Model {

  static get connection() {
    return 'designacao';
  }

  static get table() {
    return 'templates';
  }

  static get createdAtColumn() {
    return null;
  }

  static get updatedAtColumn() {
    return null;
  }

  matr_criacao () {
    return this.hasOne('App/Models/Mysql/Funci', 'funci_criacao', 'matricula')
  }

  matr_alteracao () {
    return this.hasOne('App/Models/Mysql/Funci', 'funci_alteracao', 'matricula')
  }

  tipo_historico () {
    return this.hasOne('App/Models/Mysql/Designacao/TipoHistorico', 'id_tipo_historico', 'id')
  }
}

module.exports = Tipo;
