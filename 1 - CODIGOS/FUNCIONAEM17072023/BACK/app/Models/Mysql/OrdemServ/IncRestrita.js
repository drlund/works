'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class IncRestrita extends Model {
  static get connection(){
    return 'mysqlOrdemServico';
  }

  static get table(){
    return 'ordem_ins_restritas';
  }

  static get primaryKey () {
    return 'cod_instrucao'
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

module.exports = IncRestrita
