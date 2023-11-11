'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Uors500g extends Model {

  //CONFIG
  static get table() {
    return 'mstd500g'
  }

  static get connection() {
    return 'dipes'
  }

  static get primaryKey() {
    return 'CodigoUOR'
  }

  static get createdAtColumn() {
    return null
  }

  static get updatedAtColumn() {
    return null
  }

  prefixo() {
    return this.hasOne('App/Models/Mysql/Prefixo','CodigoUOR','uor_dependencia')
  }

}

module.exports = Uors500g
