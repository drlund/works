'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Mstd501e extends Model {

  //CONFIG
  static get table() {
    return 'mstd501e'
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

module.exports = Mstd501e;
