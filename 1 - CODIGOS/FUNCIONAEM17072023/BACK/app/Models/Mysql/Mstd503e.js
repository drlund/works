'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Mstd503e extends Model {

  static get connection () {
    return 'dipes'
  }

  static get table () {
    return 'mstd503e'
  }

  static get primaryKey () {
    return 'CodigodaUOR'
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

module.exports = Mstd503e
