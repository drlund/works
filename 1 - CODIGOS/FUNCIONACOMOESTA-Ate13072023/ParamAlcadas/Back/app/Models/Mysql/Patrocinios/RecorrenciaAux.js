'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Solicitacao extends Model {
  static get connection() {
    return 'patrocinios';
  }

  static get table() {
    return 'auxiliarRecorrencia';
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(['dtEvento', 'dtInclusao'])
  }

  //formato de saida das datas
  static castDates(field, value) {
    if (field === 'dtEvento') {
      return value.format("DD/MM/YYYY")
    }
    return value.format("DD/MM/YYYY hh:mm")
  }

  // auxiliarRecorrencia() {
  //   return this.hasOne('App/Models/Mysql/Patrocinios/Recorrencia', 'id', 'idAuxiliarRecorrencia')
  // }

  // impede a criação automática deste campo na tabela
  static get createdAtColumn() {
    return null;
  }

  // impede o update automático neste campo na tabela
  static get updatedAtColumn() {
    return null;
  }
}

module.exports = Solicitacao
