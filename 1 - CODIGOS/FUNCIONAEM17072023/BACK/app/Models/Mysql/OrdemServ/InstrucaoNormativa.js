'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class InstrucaoNormativa extends Model {

  static get connection(){
    return 'mysqlOrdemServico';
  }

  static get table(){
    return 'ordem_ins_norm';
  }

  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return null
  }

}

module.exports = InstrucaoNormativa
