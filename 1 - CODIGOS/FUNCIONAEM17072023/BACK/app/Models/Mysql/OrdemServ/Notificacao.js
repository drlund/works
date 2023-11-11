'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Notificacao extends Model {

  static get connection(){
    return 'mysqlOrdemServico';
  }

  static get table(){
    return 'ordem_notificacao';
  }
  
  //campos do tipo date
  static get dates() {
    return super.dates.concat(['data_envio'])
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm")
  }

  tipoNotificacao() {
    return this.hasOne('App/Models/Mysql/OrdemServ/TipoNotificacao', 'id_tipo_notificacao', 'id')
  }

  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return null
  }

}

module.exports = Notificacao
