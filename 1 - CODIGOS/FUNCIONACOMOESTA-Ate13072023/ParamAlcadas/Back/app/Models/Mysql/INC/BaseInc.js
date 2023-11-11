'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class BaseInc extends Model {
  static get connection(){
    return 'mysqlBaseINC';
  }

  static get table(){
    return 'tb_in_vigente';
  }

  static get primaryKey(){
    return false
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

  //faz o trim no texto da instrucao
  getTxPrgfCtu(texto) {
    return texto.trim();
  }

}

module.exports = BaseInc
