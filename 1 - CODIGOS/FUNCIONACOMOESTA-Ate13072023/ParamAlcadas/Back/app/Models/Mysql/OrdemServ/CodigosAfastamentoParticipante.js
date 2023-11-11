'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class CodigosAfastamentoParticipante extends Model {
  
  static get connection(){
    return 'mysqlOrdemServico';
  }

  static get table(){
    return 'codigos_afastamento_participante';
  }

  static get primaryKey () {
    return 'codigo'
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

module.exports = CodigosAfastamentoParticipante
