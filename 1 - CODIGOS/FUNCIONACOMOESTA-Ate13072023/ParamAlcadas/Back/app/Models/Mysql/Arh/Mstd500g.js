'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Mstd500g extends Model {

  //CONFIG
  static get table() {
    return 'mstd500g'
  }

  static get connection() {
    return 'dipes'
  }

  static get createdAtColumn() {
    return null
  }

  static get updatedAtColumn() {
    return null
  }

}

module.exports = Mstd500g;
