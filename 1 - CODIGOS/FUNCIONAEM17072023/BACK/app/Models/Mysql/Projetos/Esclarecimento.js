'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Esclarecimento extends Model {
  static get connection() {
    return 'projetos'
  }

  static get table() {
    return 'esclarecimentos'
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(['dtCriacao', 'dtAtualizacao'])
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm")
  }

  projeto() {
    return this.belongsTo('App/Models/Mysql/Projetos/Projeto', 'id', 'idProjeto');
  }

  nomePedido() {
    return this.hasOne('App/Models/Mysql/Projetos/Responsavel', 'matriculaPedido', 'matricula');
  }

  nomeIndicadoResponder() {
    return this.hasOne('App/Models/Mysql/Projetos/Responsavel', 'matriculaIndicadoResponder', 'matricula');
  }

  nomeResposta() {
    return this.hasOne('App/Models/Mysql/Projetos/Responsavel', 'matriculaResposta', 'matricula');
  }

  static get createdAtColumn() {
    return 'dtCriacao';
  }

  static get updatedAtColumn() {
    return 'dtAtualizacao';
  }
}

module.exports = Esclarecimento
