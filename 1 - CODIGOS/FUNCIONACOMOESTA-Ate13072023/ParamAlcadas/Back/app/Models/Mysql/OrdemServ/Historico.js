'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Historico extends Model {

  static get connection(){
    return 'mysqlOrdemServico';
  }

  static get table(){
    return 'ordem_historico';
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(['data_evento'])
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm")
  }
  
  evento() {
    return this.hasOne('App/Models/Mysql/OrdemServ/EventoHistorico', 'id_evento', 'id')
  }

  ordem() {
    return this.belongsTo('App/Models/Mysql/OrdemServ/Ordem', 'id_ordem', 'id')
  }

  dadosParticipante() {
    return this.hasOne('App/Models/Mysql/Funci', 'matricula_participante', 'matricula')
  }

  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return null
  }
  
}

module.exports = Historico
