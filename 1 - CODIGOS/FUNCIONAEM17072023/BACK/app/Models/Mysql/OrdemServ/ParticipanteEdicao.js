'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class ParticipanteEdicao extends Model {
  
  static get connection(){
    return 'mysqlOrdemServico';
  }

  static get table(){
    return 'ordem_participante_edicao';
  }

  tipoVinculo() {
    return this.hasOne('App/Models/Mysql/OrdemServ/TipoVinculo', 'id_tipo_vinculo', 'id')
  }

  participanteExpandido() {
    return this.hasMany('App/Models/Mysql/OrdemServ/ParticipanteExpandido', 'id', 'id_part_edicao')
  }

  ordem() {
    return this.belongsTo('App/Models/Mysql/OrdemServ/Ordem', 'id_ordem', 'id')
  }

  dadosFunciVinculado() {
    return this.hasOne('App/Models/Mysql/Funci', 'matricula', 'matricula')
  }

  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return null
  }

}

module.exports = ParticipanteEdicao
