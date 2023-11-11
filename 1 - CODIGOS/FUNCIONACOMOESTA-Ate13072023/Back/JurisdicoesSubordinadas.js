// @ts-nocheck
'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class JurisdicoesSubordinadas extends Model {

  static get connection() {
    return 'mestreSas'
  }

  static get table() {
    return 'tb_jurisdicoes_subordinada'
  }

  static get createdAtColumn() {
    return null; 
  }

  static get updatedAtColumn() {
    return null; 
  }
}

module.exports = JurisdicoesSubordinadas