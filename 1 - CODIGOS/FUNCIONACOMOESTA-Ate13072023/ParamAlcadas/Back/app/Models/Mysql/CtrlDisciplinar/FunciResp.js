'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class FunciResp extends Model {

  static get table() {
    return 'funci_resps'
  }

  static get connection() {
    return 'mysqlCtrlDisciplinar'
  }

  static get primaryKey() {
    return 'id_funci_resp'
  }

  static get createdAtColumn() {
    return null
  }

  static get updatedAtColumn() {
    return null
  }

  funcionario_resp() {
    return this.hasOne('App/Models/Mysql/Funci', 'chave_funci_resp', 'matricula')
  }

}

module.exports = FunciResp
