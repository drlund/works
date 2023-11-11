'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class AcoesGestores extends Model {

  static get table() {
    return 'acoesgestores'
  }

  static get connection() {
    return 'mysqlCtrlDisciplinar'
  }

  static get primaryKey() {
    return 'id_acaogest'
  }

  static get createdAtColumn() {
    return null
  }

  static get updatedAtColumn() {
    return null
  }

  acao() {
    return this.hasOne('App/Models/Mysql/CtrlDisciplinar/Acao', 'id_acao', 'id_acao')
  }

}

module.exports = AcoesGestores
