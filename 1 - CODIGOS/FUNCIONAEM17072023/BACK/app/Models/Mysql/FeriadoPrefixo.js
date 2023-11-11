'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class FeriadoPrefixo extends Model {

  static get connection() {
    return "feriados";
  }
  static get table () {
    return 'base_feriados_prefixo'
  }
  static get primaryKey () {
    return null;
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

module.exports = FeriadoPrefixo
