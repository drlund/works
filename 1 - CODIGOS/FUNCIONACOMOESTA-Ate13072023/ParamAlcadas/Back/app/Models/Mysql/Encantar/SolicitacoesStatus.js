'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class SolicitacoesStatus extends Model {

  static get connection() {
    return 'encantar';
  }

  static get table() {
    return 'solicitacoesStatus';
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(['createdAt', 'updatedAt'])
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY hh:mm")
  }

  static get createdAtColumn() {
    return 'createdAt';
  }

  static get updatedAtColumn() {
    return 'updatedAt';
  }
}

module.exports = SolicitacoesStatus
