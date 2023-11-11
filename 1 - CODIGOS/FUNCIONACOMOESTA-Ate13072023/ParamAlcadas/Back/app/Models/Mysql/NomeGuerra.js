'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class NomeGuerra extends Model {


  static get connection () {
    return 'dipes'
  }

  static get table () {
    return 'arh_nomeguerra'
  }

  static get primaryKey () {
    return 'matricula'
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

  getNomeGuerra215(NOME_GUERRA_215){
    return String(NOME_GUERRA_215).trim().length ? String(NOME_GUERRA_215).trim() : 'NÃO INFORMADO';
  }

  static get visible () {
    return [
      'matricula',
      'NOME_GUERRA_215'
    ]
  }
}

module.exports = NomeGuerra
