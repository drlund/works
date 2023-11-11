'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class OutorgadoAutorizado extends Model {
  static get connection() {
    return 'procuracao'
  }

  static get table() {
    return 'procuracaoOutorgados'
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(['createdAt', 'updatedAt'])
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm")
  }

  procuracao() {
    return this
      .belongsTo('App/Models/Mysql/Procuracao/Procuracao', 'idProcuracao', 'id');
  }

  outorgado() {
    return  this 
      .belongsTo('App/Models/Mysql/Procuracao/Representante', 'idRepresentantesOutorgado', 'id');
  }

  static get createdAtColumn() {
    return 'createdAt';
  }

  static get updatedAtColumn() {
    return 'updatedAt';
  }
}

module.exports = OutorgadoAutorizado
