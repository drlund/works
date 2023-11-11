'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class BaseIncResumida extends Model {
  static get connection(){
    return 'mysqlBaseINC';
  }

  static get table(){
    return 'tb_in_vigente_resumida';
  }

  static get primaryKey(){
    return 'CD_ASNT'
  }

  static get incrementing () {
    return false
  }

  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return null
  }

}

module.exports = BaseIncResumida
