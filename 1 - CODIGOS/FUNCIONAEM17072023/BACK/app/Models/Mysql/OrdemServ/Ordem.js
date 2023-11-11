'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Ordem extends Model {
  static get connection(){
    return 'mysqlOrdemServico';
  }

  static get table(){
    return 'ordem';
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(['data_criacao', 'data_validade', 'data_vig_ou_revog', 'data_limite_vig_temp'])
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY")
  }

  estado() {
    return this.hasOne('App/Models/Mysql/OrdemServ/Estado', 'id_estado', 'id')
  }

  colaboradores() {
    return this.hasMany('App/Models/Mysql/OrdemServ/Colaborador', 'id', 'id_ordem')
  }

  autorizacaoConsulta() {
    return this.hasMany('App/Models/Mysql/OrdemServ/AutorizacaoConsulta', 'id', 'id_ordem')
  }

  instrucoesNormativas() {
    return this.hasMany('App/Models/Mysql/OrdemServ/InstrucaoNormativa', 'id', 'id_ordem')
  }

  participantesEdicao() {
    return this.hasMany('App/Models/Mysql/OrdemServ/ParticipanteEdicao', 'id', 'id_ordem')
  }

  historico() {
    return this.hasMany('App/Models/Mysql/OrdemServ/Historico', 'id', 'id_ordem')
  }

  notificacoes() {
    return this.hasMany('App/Models/Mysql/OrdemServ/Notificacao', 'id', 'id_ordem')
  }

  dadosAutor() {
    return this.hasOne('App/Models/Mysql/Funci', 'matricula_autor', 'matricula')
  }

  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return null
  }
}

module.exports = Ordem
