'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class AtividadePausa extends Model {
  static get connection() {
    return 'projetos'
  }

  static get table() {
    return 'atividadesPausas'
  }

  //campos do tipo date
  static get dates() {
    return super.dates.concat(['dtInicio', 'dtConclusao', 'dtCriacao', 'dtAtualizacao'])
  }

  //formato de saida das datas
  static castDates(field, value) {
    return value.format("DD/MM/YYYY HH:mm:ss")
  }

  atividade() {
    return this.belongsTo('App/Models/Mysql/Projetos/Atividade', 'idAtividadePausada', 'id');
  }

  static get createdAtColumn() {
    return 'dtCriacao';
  }

  static get updatedAtColumn() {
    return 'dtAtualizacao';
  }
}

module.exports = AtividadePausa
