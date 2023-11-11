'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Uors500g extends Model {

  //CONFIG
  static get table() {
    return 'vw_mstd500g'
  }

  static get connection() {
    return 'designacao'
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

}

module.exports = Uors500g
