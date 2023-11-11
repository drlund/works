'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ChavesApi extends Model {
  static get connection() {
    return "chavesApi";
  }

  static get table () {
    return 'chaves_api'
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(['dataCriacao'])
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm")
  }

  static get primaryKey () {
    return null;
  }

  static get incrementing () {
    return false
  }

  static get createdAtColumn () {
    return "dataCriacao"
  }

  static get updatedAtColumn () {
    return null
  }
}

module.exports = ChavesApi
