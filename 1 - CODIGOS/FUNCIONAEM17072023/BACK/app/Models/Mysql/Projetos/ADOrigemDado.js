'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ADOrigemDado extends Model {
  static get connection() {
    return 'projetos'
  }

  static get table() {
    return 'ADOrigemDados'
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(['dtCriacao', 'dtAtualizacao'])
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY hh:mm")
  }

  static get createdAtColumn() {
    return 'dtCriacao';
  }

  static get updatedAtColumn() {
    return 'dtAtualizacao';
  }
}

module.exports = ADOrigemDado
