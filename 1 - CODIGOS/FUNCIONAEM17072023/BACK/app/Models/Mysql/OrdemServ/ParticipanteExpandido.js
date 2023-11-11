'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ParticipanteExpandido extends Model {

  static get connection(){
    return 'mysqlOrdemServico';
  }

  static get table(){
    return 'ordem_participante_expandido';
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(['data_assinatura'])
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm")
  }

  participanteEdicao() {
    return this.belongsTo('App/Models/Mysql/OrdemServ/ParticipanteEdicao', 'id_part_edicao', 'id')
  }

  dadosFunci() {
    return this.hasOne('App/Models/Mysql/Funci', 'matricula', 'matricula')
  }
  
  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return null
  }

}

module.exports = ParticipanteExpandido
