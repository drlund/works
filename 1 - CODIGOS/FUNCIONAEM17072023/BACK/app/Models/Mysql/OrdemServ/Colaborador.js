'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Colaborador extends Model {
  static get connection(){
    return 'mysqlOrdemServico';
  }

  static get table(){
    return 'ordem_colaborador';
  }

  dadosFunci() {
    return this.hasOne('App/Models/Mysql/Funci', 'matricula', 'matricula')
  }

  ordem() {
    return this.belongsTo('App/Models/Mysql/OrdemServ/Ordem', 'id_ordem', 'id')
  }

  static get createdAtColumn () {
    return null
  }

  static get updatedAtColumn () {
    return null
  }

}

module.exports = Colaborador
