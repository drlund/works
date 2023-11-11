'use strict'

const moment = require("moment");

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Solicitacoes extends Model {

  static get connection () {
    return 'horasExtras'
  }

  static get table () {
    return 'solicitacoes'
  }

  static get primaryKey () {
    return 'id'
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

  static get computed () {
    return ['mesAno'];
  }

  getMesAno ({data_evento}) {
    return moment(data_evento).format("MM/YYYY");
  }

  compensacao () {
    return this.hasOne('App/Models/Mysql/HorasExtras/Compensacao','protocolo','id_solicitacao');
  }

  estado () {
    return this.hasOne('App/Models/Mysql/HorasExtras/Status','status','id_status');
  }

  bhFunci () {
    return this.hasOne('App/Models/Mysql/HorasExtras/BHFunci','mat_dest','matricula');
  }

  orcado () {
    return this.hasOne('App/Models/Mysql/HorasExtras/Orcado','pref_dest','PrefDef');
  }
}

module.exports = Solicitacoes;
